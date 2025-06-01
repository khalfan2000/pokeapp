import { useEffect, useState } from "react";

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const fetchPokemon = (offset) => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        Promise.all(
          data.results.map((p) => fetch(p.url).then((res) => res.json()))
        ).then((detailedData) => {
          setPokemon((prev) => [...prev, ...detailedData]);
          setLoading(false);
        });
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPokemon(offset);
  }, [offset]);

  const loadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pokémon List</h1>

      {error && <div className="p-4 text-red-500">Error: {error.message}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {pokemon.map((p, index) => (
          <div key={index} className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center">
            <img
              src={p.sprites.front_default}
              alt={p.name}
              className="w-24 h-24 mb-2"
            />
            <p className="text-lg capitalize font-semibold mb-1">{p.name}</p>
            <a
              href={`https://pokeapi.co/api/v2/pokemon/${p.id}`}
              className="text-blue-500 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Details
            </a>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 text-lg">Loading...</div>
      ) : (
        <button
          onClick={loadMore}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Load More
        </button>
      )}
    </div>
  );
}
