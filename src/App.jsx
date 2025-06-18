import { useState } from 'react'
import FirstPage from './1stpg';
import Love from './love';
import Aesthetic from './aesthetic';
import Multiple from './multiple';
import './index.css'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div>
      {currentPage === 'home' && <FirstPage onNavigate={handleNavigate} />}
      {currentPage === 'love' && <Love onBack={handleBack} />}
      {currentPage === 'aesthetic' && <Aesthetic onBack={handleBack} />}
      {currentPage === 'multiple' && <Multiple onBack={handleBack} />}
    </div>
  );
};

export default App;