import { useFormContext } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Textfield } from "../Textfield";

import { StudentFormData } from "./types";

import { camelize } from "@/lib/camelCase";

type ContactRole = "student" | "emergency" | "serviceCoordinator";

type PersonalInfoField = "firstName" | "lastName" | "email" | "phoneNumber";

type ContactInfoProps = {
  classname?: string;
  type: "add" | "edit";
  data: Student | null;
};

type FieldProps = {
  title: string;
  props: {
    name: string;
    placeholder: string;
    type?: string;
    defaultValue?: string;
  };
};

type FinalFieldProps = {
  name: keyof StudentFormData;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
};

type DefaultFields = Record<PersonalInfoField, FieldProps>;

type ContactInfo = Record<ContactRole, DefaultFields>;

export default function ContactInfo({ type, data, classname }: ContactInfoProps) {
  const { register } = useFormContext<StudentFormData>();

  const defaultFields: DefaultFields = {
    firstName: {
      title: "First",
      props: {
        name: "name",
        placeholder: "John",
      },
    },
    lastName: {
      title: "Last",
      props: {
        name: "last",
        placeholder: "Smith",
      },
    },
    email: {
      title: "Email",
      props: {
        name: "email",
        placeholder: "johnsmith@gmail.com",
      },
    },
    phoneNumber: {
      title: "Phone",
      props: {
        name: "phone",
        placeholder: "000-000-0000",
        type: "tel",
      },
    },
  };

  const toTitleCase = (word: string) => {
    return word
      .replace(/[A-Z]/g, " $&")
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(" ");
  };

  const parseTitle = (contactTitle: string) => {
    return ["student", "emergency"].includes(contactTitle)
      ? contactTitle + " Contact"
      : contactTitle;
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
      fieldProps.props.name = camelize(`${contactType} ${fieldProps.props.name}`);
    });
  });

  if (type === "edit" && data) {
    //Set default input values from passed in student data
    Object.entries(contactInfo).forEach(([contactType, fieldList]) => {
      Object.entries(fieldList).forEach(([fieldType, fieldProps]) => {
        fieldProps.props.defaultValue =
          data[contactType as ContactRole][fieldType as PersonalInfoField];
      });
    });
  }

  return (
    <div className={cn("grid w-full grid-rows-3 gap-10", classname)}>
      {Object.entries(contactInfo).map(([contactType, fieldList]) => {
        return (
          <div className="" key={contactType}>
            <h3 className="mb-5 text-left text-lg font-bold">
              {toTitleCase(parseTitle(contactType))}
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(fieldList).map(([fieldType, fieldProps]) => {
                return (
                  <div key={fieldType}>
                    <h3 className="mb-3">{fieldProps.title}</h3>
                    <Textfield
                      key={fieldProps.props.name}
                      register={register}
                      className="bg-white"
                      {...(fieldProps.props as FinalFieldProps)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
