import MainLayout from "../../layouts/MainLayout"
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useAuth } from "../../hooks/useAuth";


function ExercisePage() {
  const {user} = useAuth();

  return(
    <MainLayout>
        <h1 className="font-bold text-4xl">Olá, {user?.name_user || "Usuário"}!</h1>
        <p className="text-xl">Acompanhe, oriente e evolua com inteligência.</p>
    </MainLayout>  
  );
}

export default ExercisePage;
