import { ContactFrame, PasswordFrame } from "../components/InfoFrame";

export default function Profile() {
  return (
    <main>
      <div className="ml-6 mr-16 pt-10">
        {/* Title */}
        <h1 className="font-[alternate-gothic] text-4xl max-lg:text-lg">PERSONAL INFO</h1>

        <div className="text-m pt-10">
          Personal info and options to manage it. You can change or update your info at anytime.
        </div>

        <div className="pt-4">
          <ContactFrame className="" email="JohnSmith@gmail.com" />
          <PasswordFrame className="" passwordLength={25} />
        </div>
      </div>
    </main>
  );
}
