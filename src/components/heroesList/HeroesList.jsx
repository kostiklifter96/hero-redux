import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./heroesList.scss";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

import {
    heroDeleted,
    fetchHeroes,
    filteredHeroesSelected,
} from "./heroesSlice";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useHttp } from "../../hooks/http.hook";

//
const HeroesList = () => {
    const filteredHeroes = useSelector(filteredHeroesSelected);
    const heroesLoadingStatus = useSelector(
        (state) => state.reducerHeroes.heroesLoadingStatus,
    );
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback(
        (id) => {
            request(`http://localhost:3001/heroes/${id}`, "DELETE")
                .then((data) => console.log(data, "Deleted"))
                .then(dispatch(heroDeleted(id)))
                .catch((err) => console.log(err));
        }, // eslint-disable-next-line
        [request],
    );

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
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
