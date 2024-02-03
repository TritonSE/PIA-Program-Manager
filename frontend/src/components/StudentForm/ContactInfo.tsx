import { UseFormRegister } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Textfield } from "../Textfield";

import { FormData, StudentFormData } from "./types";

type ContactRole = "student" | "emergency" | "serviceCoordinator";

type PersonalInfoField = "firstName" | "lastName" | "email" | "phoneNumber";

type ContactInfoProps = {
  register: UseFormRegister<FormData>;
  classname?: string;
  type: "add" | "edit";
  data: StudentFormData | null;
};

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
};

type FinalFieldProps = {
  name: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
};

type DefaultFields = Record<PersonalInfoField, FieldProps>;

type ContactInfo = Record<ContactRole, DefaultFields>;

export default function ContactInfo({ register, type, data, classname }: ContactInfoProps) {
  const defaultFields: DefaultFields = {
    firstName: {
      name: "name",
      label: "First",
      placeholder: "John",
    },
    lastName: {
      name: "last",
      label: "Last",
      placeholder: "Smith",
    },
    email: {
      name: "email",
      label: "Email",
      placeholder: "johnsmith@gmail.com",
    },
    phoneNumber: {
      name: "phone",
      label: "Phone #",
      placeholder: "000-000-0000",
      type: "tel",
    },
  };

  const toTitleCase = (word: string) => {
    return word
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(" ");
  };

  const contactInfo: ContactInfo = {
    //Deep copy
    student: structuredClone(defaultFields),
    emergency: structuredClone(defaultFields),
    serviceCoordinator: structuredClone(defaultFields),
  };

  //Rename fields to be unique
  Object.entries(contactInfo).forEach(([contactType, fieldList]) => {
    Object.entries(fieldList).forEach(([_fieldType, fieldProps]) => {
      fieldProps.name = `${contactType}_${fieldProps.name}`;
    });
  });

  if (type === "edit" && data) {
    //Set default input values from passed in student data
    Object.entries(contactInfo).forEach(([contactType, fieldList]) => {
      Object.entries(fieldList).forEach(([fieldType, fieldProps]) => {
        fieldProps.defaultValue = data[contactType as ContactRole][fieldType as PersonalInfoField];
      });
    });
  }

  return (
    <div className={cn("grid w-full grid-rows-3 gap-5", classname)}>
      {Object.entries(contactInfo).map(([contactType, fieldList]) => {
        return (
          <div className="" key={contactType}>
            <h3 className="mb-5">{toTitleCase(contactType)}</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(fieldList).map(([_fieldType, fieldProps]) => {
                return (
                  <Textfield
                    key={fieldProps.name}
                    register={register}
                    {...(fieldProps as FinalFieldProps)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
