import { useState, useEffect } from 'react';

const LoginButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);  
    useEffect(() => {
        const hasToken = document.cookie.includes('visibleTokenLoggedIn=true');{/* Vérifie si le cookie de connexion existe */}
        setIsLoggedIn(hasToken);  
    }, []);    
    const textColor = !isLoggedIn ? 'text-gray-600 dark:text-gray-400' : 'text-white';
    const bgColor = !isLoggedIn ? 'bg-none hover:underline' : 'bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-700';
    const link = !isLoggedIn ? '/login' : '/admin1603';
    let title =  '';
    if (isLoggedIn !== null) {
        title = !isLoggedIn ? 'Se connecter' : 'Dashboard';{/* Définit le titre en fonction de l'état de connexion */}
    }
    return (
        <a href={link} className={textColor}>
            <button className={`px-2 py-1 ${bgColor} rounded transition-colors duration-200 cursor-pointer`}>
                {title}
            </button>
        </a>
    );
};
export default LoginButton;