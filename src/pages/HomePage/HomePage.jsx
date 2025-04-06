import MainLayout from "../../layouts/MainLayout"
import { userMock } from "../../mocks/userMock";
import Button from "../../components/ButtonComponent/ButtonComponent";


function HomePage() {

  return(
    <MainLayout>
        <h1 className="font-bold text-4xl">Olá, {userMock?.name || "Usuário"}!</h1>
        <p className="text-xl">Acompanhe, oriente e evolua com inteligência.</p>
    </MainLayout>  
  );
}

export default HomePage;
