import React, { useEffect, useState } from 'react';
import PokemonCards from './PokemonCards';

const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

    const fetchPokemon = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();

            const detailedPokemonData = data.results.map(async (val) => {
                const res = await fetch(val.url);
                const data = await res.json();
                return data;
            });

            const detailResponse = await Promise.all(detailedPokemonData);
            setPokemon(detailResponse);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);

    // Search functionality
    const searchData = pokemon.filter((curPokemon) =>
        curPokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Oops! Something went wrong.</h1>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <>
            <section className='container'>
                <header>
                    <h1>Let's catch Pokémon</h1>
                </header>

                <div className='pokemon-search'>
                    <input
                        type='text'
                        placeholder='Search Pokémon'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div>
                    <ul className='cards'>
                        {searchData.length > 0 ? (
                            searchData.map((curPokemon) => (
                                <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
                            ))
                        ) : (
                            <p>No Pokémon found.</p>
                        )}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default Pokemon;