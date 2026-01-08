import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LovedOne } from "@/lib/types";

interface LovedOnesProps {
  lovedOnes: LovedOne[];
  userId: string;
  onUpdate: () => void;
  onScheduleCall: (lovedOne: LovedOne) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const LovedOnes: React.FC<LovedOnesProps> = ({
  lovedOnes,
  userId,
  onUpdate,
  onScheduleCall,
  onSuccess,
  onError,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLovedOne, setSelectedLovedOne] = useState<LovedOne | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    age: "",
    phone: "",
    notes: "",
    personality_notes: "",
    favorite_things: [""],
    image1File: null as File | null,
    image2File: null as File | null,
    image1Preview: "",
    image2Preview: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "",
      age: "",
      phone: "",
      notes: "",
      personality_notes: "",
      favorite_things: [""],
      image1File: null,
      image2File: null,
      image1Preview: "",
      image2Preview: "",
    });
  };

  const handleImageSelect = (imageNumber: 1 | 2, file: File | null) => {
    if (file) {
      // Validate image type and size
      if (!file.type.startsWith("image/")) {
        onError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageNumber === 1) {
          setFormData({
            ...formData,
            image1File: file,
            image1Preview: reader.result as string,
          });
        } else {
          setFormData({
            ...formData,
            image2File: file,
            image2Preview: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Clear image when file is null (remove clicked)
      if (imageNumber === 1) {
        setFormData({ ...formData, image1File: null, image1Preview: "" });
      } else {
        setFormData({ ...formData, image2File: null, image2Preview: "" });
      }
    }
  };


  const uploadImages = async (lovedOneId: string) => {
    const paths: { image1?: string; image2?: string } = {};

    if (formData.image1File) {
      const ext = formData.image1File.name.split(".").pop();
      const path = `${userId}/${lovedOneId}/profile-1.${ext}`;
      const { error } = await supabase.storage
        .from("loved-ones-images")
        .upload(path, formData.image1File, { upsert: true });

      if (error) throw error;
      paths.image1 = path;
    }

    if (formData.image2File) {
      const ext = formData.image2File.name.split(".").pop();
      const path = `${userId}/${lovedOneId}/profile-2.${ext}`;
      const { error } = await supabase.storage
        .from("loved-ones-images")
        .upload(path, formData.image2File, { upsert: true });

      if (error) throw error;
      paths.image2 = path;
    }

    return paths;
  };

  const addFavoriteThing = () => {
    setFormData({
      ...formData,
      favorite_things: [...formData.favorite_things, ""],
    });
  };

  const removeFavoriteThing = (index: number) => {
    const newFavorites = formData.favorite_things.filter((_, i) => i !== index);
    setFormData({ ...formData, favorite_things: newFavorites });
  };

  const updateFavoriteThing = (index: number, value: string) => {
    const newFavorites = [...formData.favorite_things];
    newFavorites[index] = value;
    setFormData({ ...formData, favorite_things: newFavorites });
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      onError("Name is required");
      return;
    }

    setLoading(true);

    try {
      const cleanFavorites = formData.favorite_things.filter(
        (f) => f.trim() !== ""
      );

      const { data: lovedOne, error: insertError } = await supabase
        .from("loved_ones")
        .insert({
          user_id: userId,
          name: formData.name,
          relationship: formData.relationship || null,
          age: formData.age ? parseInt(formData.age) : null,
          phone: formData.phone || null,
          notes: formData.notes || null,
          personality_notes: formData.personality_notes || null,
          favorite_things: cleanFavorites,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (formData.image1File || formData.image2File) {
        setUploadingImages(true);
        const imagePaths = await uploadImages(lovedOne.id);

        await supabase
          .from("loved_ones")
          .update({
            profile_image_1: imagePaths.image1 || null,
            profile_image_2: imagePaths.image2 || null,
          })
          .eq("id", lovedOne.id);
      }

      onSuccess(`${formData.name} has been added successfully!`);
      setShowAddModal(false);
      resetForm();
      onUpdate();
    } catch (error: any) {
      onError(error.message || "Failed to add loved one");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedLovedOne || !formData.name.trim()) {
      onError("Name is required");
      return;
    }

    setLoading(true);

    try {
      const cleanFavorites = formData.favorite_things.filter(
        (f) => f.trim() !== ""
      );

      if (formData.image1File || formData.image2File) {
        setUploadingImages(true);
        const imagePaths = await uploadImages(selectedLovedOne.id);

        await supabase
          .from("loved_ones")
          .update({
            name: formData.name,
            relationship: formData.relationship || null,
            age: formData.age ? parseInt(formData.age) : null,
            phone: formData.phone || null,
            notes: formData.notes || null,
            personality_notes: formData.personality_notes || null,
            favorite_things: cleanFavorites,
            profile_image_1:
              imagePaths.image1 || selectedLovedOne.profile_image_1,
            profile_image_2:
              imagePaths.image2 || selectedLovedOne.profile_image_2,
          })
          .eq("id", selectedLovedOne.id);
      } else {
        await supabase
          .from("loved_ones")
          .update({
            name: formData.name,
            relationship: formData.relationship || null,
            age: formData.age ? parseInt(formData.age) : null,
            phone: formData.phone || null,
            notes: formData.notes || null,
            personality_notes: formData.personality_notes || null,
            favorite_things: cleanFavorites,
          })
          .eq("id", selectedLovedOne.id);
      }

      onSuccess(`${formData.name}'s information has been updated!`);
      setShowEditModal(false);
      setSelectedLovedOne(null);
      resetForm();
      onUpdate();
    } catch (error: any) {
      onError(error.message || "Failed to update loved one");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLovedOne) return;
    setLoading(true);

    try {
      if (selectedLovedOne.profile_image_1) {
        await supabase.storage
          .from("loved-ones-images")
          .remove([selectedLovedOne.profile_image_1]);
      }
      if (selectedLovedOne.profile_image_2) {
        await supabase.storage
          .from("loved-ones-images")
          .remove([selectedLovedOne.profile_image_2]);
      }

      const { error } = await supabase
        .from("loved_ones")
        .delete()
        .eq("id", selectedLovedOne.id);

      if (error) throw error;

      onSuccess(`${selectedLovedOne.name} has been removed`);
      setShowDeleteModal(false);
      setSelectedLovedOne(null);
      onUpdate();
    } catch (error: any) {
      onError(error.message || "Failed to delete loved one");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (lovedOne: LovedOne) => {
    setSelectedLovedOne(lovedOne);

    let image1Url = "";
    let image2Url = "";

    if (lovedOne.profile_image_1) {
      const { data } = supabase.storage
        .from("loved-ones-images")
        .getPublicUrl(lovedOne.profile_image_1);
      image1Url = data.publicUrl;
    }

    if (lovedOne.profile_image_2) {
      const { data } = supabase.storage
        .from("loved-ones-images")
        .getPublicUrl(lovedOne.profile_image_2);
      image2Url = data.publicUrl;
    }

    setFormData({
      name: lovedOne.name,
      relationship: lovedOne.relationship || "",
      age: lovedOne.age?.toString() || "",
      phone: lovedOne.phone || "",
      notes: lovedOne.notes || "",
      personality_notes: lovedOne.personality_notes || "",
      favorite_things:
        lovedOne.favorite_things?.length > 0 ? lovedOne.favorite_things : [""],
      image1File: null,
      image2File: null,
      image1Preview: image1Url,
      image2Preview: image2Url,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (lovedOne: LovedOne) => {
    setSelectedLovedOne(lovedOne);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-[#1a2332]">Your Loved Ones</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#d4af37] text-[#1a2332] font-medium rounded-sm hover:bg-[#e5c55a] transition-colors"
        >
          Add Loved One
        </button>
      </div>

      {lovedOnes.length === 0 ? (
        <EmptyState onAdd={() => setShowAddModal(true)} />
      ) : (
        <LovedOnesList
          lovedOnes={lovedOnes}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onSchedule={onScheduleCall}
        />
      )}

      {(showAddModal || showEditModal) && (
        <LovedOneFormModal
          isEdit={showEditModal}
          formData={formData}
          loading={loading}
          uploadingImages={uploadingImages}
          onClose={() => {
            showAddModal ? setShowAddModal(false) : setShowEditModal(false);
            setSelectedLovedOne(null);
            resetForm();
          }}
          onSubmit={showAddModal ? handleAdd : handleEdit}
          onImageSelect={handleImageSelect}
          onAddFavorite={addFavoriteThing}
          onRemoveFavorite={removeFavoriteThing}
          onUpdateFavorite={updateFavoriteThing}
          setFormData={setFormData}
        />
      )}

      {showDeleteModal && selectedLovedOne && (
        <DeleteModal
          lovedOne={selectedLovedOne}
          loading={loading}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedLovedOne(null);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <div className="bg-white p-12 rounded-lg text-center">
    <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-10 h-10 text-[#d4af37]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
    <p className="text-[#1a2332]/60 mb-4">No loved ones added yet</p>
    <button
      onClick={onAdd}
      type="button"
      className="text-[#d4af37] font-medium hover:underline"
    >
      Add your first loved one
    </button>
  </div>
);

const LovedOnesList: React.FC<{
  lovedOnes: LovedOne[];
  onEdit: (loved: LovedOne) => void;
  onDelete: (loved: LovedOne) => void;
  onSchedule: (loved: LovedOne) => void;
}> = ({ lovedOnes, onEdit, onDelete, onSchedule }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {lovedOnes.map((loved) => (
      <LovedOneCard
        key={loved.id}
        lovedOne={loved}
        onEdit={() => onEdit(loved)}
        onDelete={() => onDelete(loved)}
        onSchedule={() => onSchedule(loved)}
      />
    ))}
  </div>
);

const LovedOneCard: React.FC<{
  lovedOne: LovedOne;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule: () => void;
}> = ({ lovedOne, onEdit, onDelete, onSchedule }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      {lovedOne.profile_image_1 && (
        <img
          src={
            supabase.storage
              .from("loved-ones-images")
              .getPublicUrl(lovedOne.profile_image_1).data.publicUrl
          }
          alt={lovedOne.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]"
        />
      )}
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 text-[#1a2332]/40 hover:text-[#d4af37] transition-colors"
          title="Edit"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-[#1a2332]/40 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
    <h3 className="text-lg font-serif text-[#1a2332] mb-1">{lovedOne.name}</h3>
    <p className="text-[#1a2332]/60 text-sm mb-1">
      {lovedOne.relationship}
      {lovedOne.age && ` • ${lovedOne.age} years old`}
    </p>
    <p className="text-[#1a2332]/40 text-sm mb-2">
      {lovedOne.phone || "No phone added"}
    </p>

    {lovedOne.favorite_things && lovedOne.favorite_things.length > 0 && (
      <div className="mt-2 pt-2 border-t border-[#1a2332]/10">
        <p className="text-xs text-[#1a2332]/50 mb-1">Loves:</p>
        <div className="flex flex-wrap gap-1">
          {lovedOne.favorite_things.slice(0, 3).map((thing, idx) => (
            <span
              key={idx}
              className="text-xs bg-[#d4af37]/10 text-[#1a2332]/70 px-2 py-0.5 rounded"
            >
              {thing}
            </span>
          ))}
          {lovedOne.favorite_things.length > 3 && (
            <span className="text-xs text-[#1a2332]/50">
              +{lovedOne.favorite_things.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}

    <div className="mt-4 pt-4 border-t border-[#1a2332]/10">
      <button
        onClick={onSchedule}
        className="w-full py-2 text-sm text-[#d4af37] font-medium hover:bg-[#d4af37]/5 rounded transition-colors"
      >
        Schedule Call
      </button>
    </div>
  </div>
);

const LovedOneFormModal: React.FC<any> = ({
  isEdit,
  formData,
  loading,
  uploadingImages,
  onClose,
  onSubmit,
  onImageSelect,
  onAddFavorite,
  onRemoveFavorite,
  onUpdateFavorite,
}) => {
  const form = useForm({
    defaultValues: {
      name: formData.name || "",
      relationship: formData.relationship || "",
      age: formData.age || "",
      phone: formData.phone || "",
      personality_notes: formData.personality_notes || "",
      notes: formData.notes || "",
    },
  });

  return (
    <Modal
      title={isEdit ? "Edit Loved One" : "Add Loved One"}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Profile Image 1"
              preview={formData.image1Preview}
              onSelect={(file) => onImageSelect(1, file)}
            />
            <ImageUpload
              label="Profile Image 2 (Optional)"
              preview={formData.image2Preview}
              onSelect={(file) => onImageSelect(2, file)}
            />
          </div>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Relationship */}
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="tel"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Favorites (still state-based, OK for now) */}
          <FavoriteThingsList
            favorites={formData.favorite_things}
            onAdd={onAddFavorite}
            onRemove={onRemoveFavorite}
            onUpdate={onUpdateFavorite}
          />

          {/* Personality Notes */}
          <FormField
            control={form.control}
            name="personality_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personality Notes</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Additional Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={2}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#1a2332]/20 rounded-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1 py-3 bg-[#d4af37] text-[#1a2332] font-semibold rounded-sm flex items-center justify-center"
            >
              {loading || uploadingImages ? (
                <>
                  <Spinner />
                  <span className="ml-2">
                    {uploadingImages
                      ? "Uploading..."
                      : isEdit
                      ? "Updating..."
                      : "Adding..."}
                  </span>
                </>
              ) : isEdit ? (
                "Update"
              ) : (
                "Add Loved One"
              )}
            </button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const FavoriteThingsList: React.FC<{
  favorites: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, value: string) => void;
}> = ({ favorites, onAdd, onRemove, onUpdate }) => (
  <div>
    <label className="block text-sm font-medium text-[#1a2332] mb-2">
      Favorite Things
    </label>
    {favorites.map((thing, idx) => (
      <div key={idx} className="flex gap-2 mb-2">
        <input
          type="text"
          value={thing}
          onChange={(e) => onUpdate(idx, e.target.value)}
          placeholder="e.g., Gardening, Reading"
          className="flex-1 px-4 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
        />
        {favorites.length > 1 && (
          <button
            onClick={() => onRemove(idx)}
            className="p-2 text-red-500 hover:bg-red-50 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="text-sm text-[#d4af37] hover:underline"
    >
      + Add another favorite thing
    </button>
  </div>
);

const DeleteModal: React.FC<{
  lovedOne: LovedOne;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
}> = ({ lovedOne, loading, onClose, onDelete }) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h4 className="text-lg font-semibold text-[#1a2332] mb-2">
        Delete {lovedOne.name}?
      </h4>
      <p className="text-[#1a2332]/60 mb-6">
        This action cannot be undone. All scheduled calls and recordings
        associated with this loved one will also be deleted.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 border border-[#1a2332]/20 rounded-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={loading}
          className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ml-2">Deleting...</span>
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </Modal>
);

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-[#1a2332]/80 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#1a2332]/40 hover:text-[#1a2332] transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h3 className="text-xl font-serif text-[#1a2332] mb-6">{title}</h3>
      {children}
    </div>
  </div>
);

const ImageUpload: React.FC<{
  label: string;
  preview: string;
  onSelect: (file: File | null) => void;
}> = ({ label, preview, onSelect }) => (
  <div>
    <label className="block text-sm font-medium text-[#1a2332] mb-4">
      {label}
    </label>

    {preview ? (
      <div className="relative">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-32 
          object-cover 
          rounded-lg"
        />
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="absolute top-2 right-2 p-1 
          bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#1a2332]/20 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
        <svg
          className="w-8 h-8 text-[#1a2332]/40 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <span className="text-xs text-[#1a2332]/60">Upload Image</span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
        />
      </label>
    )}
  </div>
);

const Spinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default LovedOnes;