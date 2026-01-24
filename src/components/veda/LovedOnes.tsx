// deno-lint-ignore-file jsx-button-has-type no-explicit-any
import React, { useState } from "react";
import { supabase } from "../../lib/supabase.ts";
import { LovedOne } from "../../lib/types.ts";
import { EmptyState } from "./EmptyState.tsx";
import { LovedOnesList } from "./LovedOnesList.tsx";
import { LovedOneFormModal } from "./LovedOneFormModal.tsx";
import { DeleteModal } from "./DeleteModal.tsx";
import { normalizePhone } from "../../utils/phoneUtils.ts";
import { COUNTRY_CODES } from "../../utils/CountryCode.ts";

interface LovedOnesProps {
  lovedOnes: LovedOne[];
  userId: string;
  onUpdate: () => void;
  onScheduleCall: (lovedOne: LovedOne) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export interface FormData {
  name: string;
  relationship: string;
  age: string;
  phoneLocal: string;
  countryCode: string;
  notes: string;
  personality_notes: string;
  favorite_things: string[];
  image1File: File | null;
  image2File: File | null;
  image1Preview: string;
  image2Preview: string;
}

const initialFormData: FormData = {
  name: "",
  relationship: "",
  age: "",
  phoneLocal: "",
  countryCode: "+234",
  notes: "",
  personality_notes: "",
  favorite_things: [""],
  image1File: null,
  image2File: null,
  image1Preview: "",
  image2Preview: "",
};

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
    null,
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleImageSelect = (imageNumber: 1 | 2, file: File | null) => {
    if (file) {
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
          setFormData((prev) => ({
            ...prev,
            image1File: file,
            image1Preview: reader.result as string,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            image2File: file,
            image2Preview: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (imageNumber === 1) {
        setFormData((prev) => ({
          ...prev,
          image1File: null,
          image1Preview: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image2File: null,
          image2Preview: "",
        }));
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
    setFormData((prev) => ({
      ...prev,
      favorite_things: [...prev.favorite_things, ""],
    }));
  };

  const removeFavoriteThing = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      favorite_things: prev.favorite_things.filter((_, i) => i !== index),
    }));
  };

  const updateFavoriteThing = (index: number, value: string) => {
    setFormData((prev) => {
      const newFavorites = [...prev.favorite_things];
      newFavorites[index] = value;
      return { ...prev, favorite_things: newFavorites };
    });
  };

  const handleAdd = async (values: any) => {
    if (!values.name.trim()) {
      onError("Name is required");
      return;
    }

    setLoading(true);
    let imagePaths: { image1?: string; image2?: string } | null = null;

    try {
      const cleanFavorites = formData.favorite_things.filter(
        (f) => f.trim() !== "",
      );
      const finalPhone = formData.phoneLocal.trim()
        ? normalizePhone(formData.countryCode, formData.phoneLocal)
        : null;

      const { data: lovedOne, error } = await supabase
        .from("loved_ones")
        .insert({
          user_id: userId,
          name: values.name,
          relationship: values.relationship || null,
          age: values.age ? parseInt(values.age) : null,
          phone: finalPhone,
          notes: values.notes || null,
          personality_notes: values.personality_notes || null,
          favorite_things: cleanFavorites,
        })
        .select()
        .single();

      if (error) throw error;

      if (formData.image1File || formData.image2File) {
        setUploadingImages(true);
        imagePaths = await uploadImages(lovedOne.id);

        await supabase
          .from("loved_ones")
          .update({
            profile_image_1: imagePaths.image1 || null,
            profile_image_2: imagePaths.image2 || null,
          })
          .eq("id", lovedOne.id);
      }

      onSuccess(`${values.name} has been added successfully!`);
      setShowAddModal(false);
      resetForm();
      onUpdate();
    } catch (err: any) {
      onError(err.message || "Failed to add loved one");

      if (imagePaths?.image1) {
        await supabase.storage
          .from("loved-ones-images")
          .remove([imagePaths.image1]);
      }
      if (imagePaths?.image2) {
        await supabase.storage
          .from("loved-ones-images")
          .remove([imagePaths.image2]);
      }
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleEdit = async (values: any) => {
    if (!selectedLovedOne || !values.name.trim()) {
      onError("Name is required");
      return;
    }

    setLoading(true);

    try {
      const cleanFavorites = formData.favorite_things.filter(
        (f) => f.trim() !== "",
      );
      const finalPhone = formData.phoneLocal.trim()
        ? normalizePhone(formData.countryCode, formData.phoneLocal)
        : null;

      let updateData: any = {
        name: values.name,
        relationship: values.relationship || null,
        age: values.age ? parseInt(values.age) : null,
        phone: finalPhone,
        notes: values.notes || null,
        personality_notes: values.personality_notes || null,
        favorite_things: cleanFavorites,
      };

      if (formData.image1File || formData.image2File) {
        setUploadingImages(true);
        const imagePaths = await uploadImages(selectedLovedOne.id);

        updateData.profile_image_1 =
          imagePaths.image1 || selectedLovedOne.profile_image_1;
        updateData.profile_image_2 =
          imagePaths.image2 || selectedLovedOne.profile_image_2;
      }

      const { error } = await supabase
        .from("loved_ones")
        .update(updateData)
        .eq("id", selectedLovedOne.id);

      if (error) throw error;

      onSuccess(`${values.name}'s information has been updated!`);
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

    let countryCode = "+234";
    let phoneLocal = "";

    if (lovedOne.phone?.startsWith("+")) {
      const match = COUNTRY_CODES.find((c) =>
        lovedOne.phone!.startsWith(c.code),
      );
      if (match) {
        countryCode = match.code;
        phoneLocal = lovedOne.phone.replace(match.code, "");
      }
    }

    setFormData({
      name: lovedOne.name,
      relationship: lovedOne.relationship || "",
      age: lovedOne.age?.toString() || "",
      phoneLocal,
      countryCode,
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

export default LovedOnes;
