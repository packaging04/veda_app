// deno-lint-ignore-file no-explicit-any
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form.tsx";
import { FormData } from "./LovedOnes.tsx";
import { Modal } from "./Modal.tsx";
import { ImageUpload } from "./ImageUpload.tsx";
import { FavoriteThingsList } from "./FavoriteThingsList.tsx";
import { PhoneInput } from "./PhoneInput.tsx";
import { Spinner } from "./Spinner.tsx";
//https://api.africastalking.com/test/voice

interface LovedOneFormModalProps {
  isEdit: boolean;
  formData: FormData;
  loading: boolean;
  uploadingImages: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  onImageSelect: (imageNumber: 1 | 2, file: File | null) => void;
  onAddFavorite: () => void;
  onRemoveFavorite: (idx: number) => void;
  onUpdateFavorite: (idx: number, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const LovedOneFormModal: React.FC<LovedOneFormModalProps> = ({
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
  setFormData,
}) => {
  const form = useForm({
    defaultValues: {
      name: formData.name || "",
      relationship: formData.relationship || "",
      age: formData.age || "",
      personality_notes: formData.personality_notes || "",
      notes: formData.notes || "",
    },
  });

  // Update form values when formData changes (important for edit mode)
  React.useEffect(() => {
    form.reset({
      name: formData.name || "",
      relationship: formData.relationship || "",
      age: formData.age || "",
      personality_notes: formData.personality_notes || "",
      notes: formData.notes || "",
    });
  }, [formData, form]);

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
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                    placeholder="Enter name"
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
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                    placeholder="e.g., Mother, Father, Friend"
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
                      className="w-full rounded-md border px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                      placeholder="Age"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PhoneInput formData={formData} setFormData={setFormData} />
          </div>

          {/* Favorites */}
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
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                    placeholder="What's their personality like?"
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
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                    placeholder="Any other important information"
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
              className="flex-1 py-3 border border-[#1a2332]/20 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1 py-3 bg-[#d4af37] text-[#1a2332] font-semibold rounded-sm hover:bg-[#e5c55a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
