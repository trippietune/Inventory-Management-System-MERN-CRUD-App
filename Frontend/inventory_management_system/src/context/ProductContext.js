import { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const triggerRefresh = () => {
    setShouldRefresh(prev => !prev);
  };

  return (
    <ProductContext.Provider value={{ shouldRefresh, triggerRefresh }}>
      {children}
    </ProductContext.Provider>
  );
};