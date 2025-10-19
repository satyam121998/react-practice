import { useEffect } from "react";

function Shopping() {

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json();
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);
  return <h1>Welcome to the E-Commerce Page</h1>;
}

export default Shopping;