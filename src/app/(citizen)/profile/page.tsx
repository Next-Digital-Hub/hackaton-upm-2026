import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/features/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      province: true,
      housingType: true,
      specialNeeds: true,
      phone: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="flex justify-center py-6">
      <ProfileForm
        user={{
          name: user.name ?? "",
          email: user.email,
          province: user.province,
          housingType: user.housingType,
          specialNeeds: user.specialNeeds as string[],
          phone: user.phone,
        }}
      />
    </div>
  );
}
