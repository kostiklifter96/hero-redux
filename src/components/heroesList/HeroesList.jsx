import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import "./heroesList.scss";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDeleteHeroMutation, useGetHeroesQuery } from "../../api/apiSlice";

const HeroesList = () => {
    const { data: heroes = [], isLoading, isError } = useGetHeroesQuery();
    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(
        (state) => state.reducerFilters.activeFilter,
    );

    const filteredHeroes = useMemo(() => {
        const filteredHeroes = heroes.slice();
        if (activeFilter === "all") {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(
                (item) => item.element === activeFilter,
            );
        }
    }, [heroes, activeFilter]);

    const onDelete = useCallback((id) => {
        deleteHero(id);
    }, []);

    if (isLoading) {
        return <Spinner />;
    } else if (isError) {
        return <h5 className='text-center mt-5'>Ошибка загрузки</h5>;
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={500} classNames='hero'>
                    <h5 className='text-center mt-5'>Героев пока нет</h5>
                </CSSTransition>
            );
        }

        return arr.map(({ id, ...props }) => {
            return (
                <CSSTransition
                    key={id}
                    in='true'
                    timeout={500}
                    classNames='hero'
                >
                    <HeroesListItem
                        key={id}
                        onDelete={() => onDelete(id)}
                        {...props}
                    />
                </CSSTransition>
            );
        });
    };

    const elements = renderHeroesList(filteredHeroes);

    return <TransitionGroup component='ul'>{elements}</TransitionGroup>;
};

export default HeroesList;
