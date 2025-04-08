import { useState, useEffect } from 'react';

const LoginButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);  
    useEffect(() => {
        const hasToken = document.cookie.includes('visibleTokenLoggedIn=true');
        setIsLoggedIn(hasToken);  
    }, []);    
    const textColor = !isLoggedIn ? 'text-gray-500' : 'text-blue-500';
    const bgColor = !isLoggedIn ? 'bg-none hover:underline' : 'bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-700';
    const link = !isLoggedIn ? '/login' : '/admin1603';
    let title =  '';
    if (isLoggedIn !== null) {
        title = !isLoggedIn ? 'Se connecter' : 'Dashboard';
    }
    return (
        <a href={link} className={textColor}>
            <button className={`px-2 py-1 ${bgColor} text-white rounded transition-colors duration-200 cursor-pointer`}>
                {title}
            </button>
        </a>
    );
};
export default LoginButton;