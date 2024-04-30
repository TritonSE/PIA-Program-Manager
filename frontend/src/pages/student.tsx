export default function Student() {
  return (
    <main className="mx-[30px] space-y-[60px]">
      <div id="header" className="mt-[70px] space-y-[50px]">
        <div className="font-[alternate-gothic] text-4xl text-[96px]">Alice Anderson</div>
        <div id="contact" className="space-y-[16px] font-[Poppins-Bold] text-[21px]">
          <div id="line 1" className="flex space-x-[40px]">
            <div>Aliceanders@gmail.com </div>
            <div>123-123-1234</div>
          </div>
          <div>UCI # 123456</div>
        </div>
      </div>
      <div id="row1" className="flex space-x-[230px]">
        <div id="emergency contact" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Emergency Contact:</div>
          <div className="font-[Poppins] text-[24px]">Name: Olivia Anderson</div>
          <div className="font-[Poppins] text-[24px]">Email: Olivia626@gmail.com</div>
          <div className="font-[Poppins] text-[24px]">Phone: 555-123-4567</div>
        </div>
        <div id="service coordinator" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Service Coordinator:</div>
          <div className="font-[Poppins] text-[24px]">Name: Karen Roth</div>
          <div className="font-[Poppins] text-[24px]">Email: Karenr@plantitagain.org</div>
          <div className="font-[Poppins] text-[24px]">Phone: 321-123-4356</div>
        </div>
      </div>
      <div id="row2" className="flex space-x-[230px]">
        <div id="student background" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Student Background:</div>
          <div className="font-[Poppins] text-[24px]">Address: 4567 Maple Street</div>
          <div className="font-[Poppins] text-[24px]">Birthdate: 06/12/2002</div>
        </div>
        <div id="student information" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Student Information:</div>
          <div className="font-[Poppins] text-[24px]">Intake Date: 01/12/2023</div>
          <div className="font-[Poppins] text-[24px]">Tour Date: 01/10/2023</div>
        </div>
      </div>
      <div id="row3" className="flex space-x-[230px]">
        <div id="documents" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Documents</div>
          <div> buttons placeholder 0-0</div>
        </div>
        <div id="medications" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Medication & Medical</div>
          <div className="font-[Poppins] text-[24px]">
            Dietary Restrictions:
            <br></br>
            Gluten Free
            <br></br>
            Shellfish
          </div>
          <div className="font-[Poppins] text-[24px]">Medication: NA</div>
        </div>
      </div>
      <div id="row4" className="flex space-x-[230px]">
        <div id="regular" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Regular Programs:</div>
          <div className="font-[Poppins-Bold] text-[24px]">INTRO - Joined</div>
          <div className="font-[Poppins] text-[24px]">Start Date: 01/25/2023</div>
          <div className="font-[Poppins] text-[24px]">End Date: 02/25/2023</div>
          <div className="font-[Poppins] text-[24px]">Renewal Date: 02/25/2023</div>
          <div className="font-[Poppins] text-[24px]">Authorization Code: 123456 </div>
        </div>
        <div id="varying" className="basis-1/2 space-y-[20px]">
          <div className="font-[Poppins-Bold] text-[28px]">Varying Programs:</div>
          <div className="font-[Poppins-Bold] text-[24px]">TDS - Waitlist</div>
          <div className="font-[Poppins] text-[24px]">Start Date: 02/25/2024</div>
          <div className="font-[Poppins] text-[24px]">End Date: 03/25/2024</div>
          <div className="font-[Poppins] text-[24px]">Renewal Date: 02/25/2023</div>
          <div className="font-[Poppins] text-[24px]">Authorization Code: 654321</div>
          <div className="font-[Poppins] text-[24px]">Days of the Week</div>
          <div> days of week placeholder 0-0</div>
        </div>
      </div>
      {/* <div className="my-[30px] ml-[20px] mr-[80px] space-y-[20px]">
          <div className="font-[alternate-gothic] text-4xl uppercase">Notifications</div>
          <div className="font-[Poppins] text-[16px]">
            Review information of new account creations below to approve or deny them.{" "}
          </div>
          <NotificationTable />
        </div> */}
    </main>
  );
}
