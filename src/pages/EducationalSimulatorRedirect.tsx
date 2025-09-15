import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function EducationalSimulatorRedirect() {
  const nav = useNavigate();
  useEffect(() => {
    nav("/daily-program", { replace: true });
  }, [nav]);
  return null;
}
