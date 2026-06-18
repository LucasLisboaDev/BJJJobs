import GymSignUp from "@/components/gym-sign-up";
import CoachSignUp from "@/components/coach-sign-up";
import RegisterRolePicker from "@/components/register-role-picker";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  if (searchParams.role === "gym") {
    return <GymSignUp />;
  }

  if (searchParams.role === "coach") {
    return <CoachSignUp />;
  }

  return <RegisterRolePicker />;
}
