// app/exist/page.tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ExistPage() {

  const user = await prisma.login.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      congregationNumber: true,
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 h-full bg-[#c2d5d4] flex items-center justify-center">
          <div className="bg-[#fcfdff] rounded-lg shadow-md p-6 w-[95%] max-w-[320px] text-center">
            <img src="/check.png" alt="Logo" className="w-8 h-8 mx-auto mb-3" />
            <p className="text-black text-xs font-bold mb-2">
              Thank you for requesting to join Congregation #{user?.congregationNumber ?? "____"}
            </p>
            <p className="text-gray-700 text-xs mb-4">
              An email has been sent to the administrator to review your admission.
              To help speed up the process, you may personally contact the admin
              as a reminder to approve your access.
            </p>
            <a
              href="mailto:admin@example.com"
              className="text-[#072fcf] text-[10px] underline hover:text-blue-800"
            >
              mail the admin
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img src="/logo1.png" alt="Preview" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
