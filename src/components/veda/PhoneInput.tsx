import React from "react";
import { FormLabel } from "../ui/form.tsx";
import { FormData } from "./LovedOnes.tsx";
import { COUNTRY_CODES } from "../../utils/CountryCode.ts";
import { normalizePhone } from "../../utils/phoneUtils.ts";

interface PhoneInputProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div>
      <FormLabel>Phone Number</FormLabel>
      <div className="flex gap-2">
        {/* Country Code Select */}
        <select
          value={formData.countryCode}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              countryCode: e.target.value,
            }))
          }
          className="rounded-md border px-3 py-2 w-32 focus:outline-none focus:border-[#d4af37]"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>

        {/* Phone Input */}
        <input
          type="tel"
          value={formData.phoneLocal}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              phoneLocal: e.target.value,
            }))
          }
          placeholder="8165758478"
          className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:border-[#d4af37]"
        />
      </div>

      <p className="text-xs text-[#1a2332]/50 mt-1">
        Saved as:{" "}
        <span className="font-mono">
          {formData.phoneLocal
            ? normalizePhone(formData.countryCode, formData.phoneLocal)
            : "—"}
        </span>
      </p>
    </div>
  );
};
