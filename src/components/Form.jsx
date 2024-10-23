/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';

const Form = (props) => {
  const [watchElem, setWatchElem] = useState({ name: '', userTimezone: '' });

  const nameRef = useRef('');

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target;

    setWatchElem(prevState => ({ ...prevState, [name]: value }));
  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
    props.onFormSubmit(watchElem);
    setWatchElem({ name: '', userTimezone: '' });
    nameRef.current.focus();
  }

  return (
    <form
      className="form"
      onSubmit={formSubmitHandler}
    >
      <div className="form-control">
        <label className="form-label" htmlFor="name">
          Название
        </label>
        <input
          className="form-control__name"
          type="text"
          id="name"
          name="name"
          value={watchElem.name}
          onChange={inputChangeHandler}
          ref={nameRef}
          autoComplete="off"
          required
        />
      </div>
      <div className="form-control">
        <label className="form-label" htmlFor="user-timezone">
          Временная зона
        </label>
        <input
          className="form-control__user-timezone"
          type="number"
          id="user-timezone"
          name="userTimezone"
          min="-12"
          max="14"
          value={watchElem.userTimezone}
          onChange={inputChangeHandler}
          required
        />
      </div>
      <button className="form-control__button-add" type="submit">
        Добавить
      </button>
    </form>
  );
};


export default Form;
