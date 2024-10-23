import {nanoid} from 'nanoid';
import {useState} from 'react';
import Form from './components/Form';
import Clock from './components/Clock';

function App() {
    const [clocks, setClocks] = useState([]);

    function handleFormSubmit(form) {
        setClocks((prevState) => [...prevState, {
            id: nanoid(),
            name: form.name,
            userTimezone: form.userTimezone,
        }]);
    }

    function getClockIndex(id) {
        return clocks.findIndex((clock) => clock.id === id);
    }

    function handleDeleteClick(id) {
        const index = getClockIndex(id);

        const updatedClocks = [
            ...clocks.slice(0, index),
            ...clocks.slice(index + 1),
        ];

        setClocks(updatedClocks);
    }

    return (
        <div className="container">
            <Form onFormSubmit={handleFormSubmit} />
            <div className="clocks">
                {clocks.map((clock) => {
                    return (
                        <Clock
                            key={clock.id}
                            id={clock.id}
                            name={clock.name}
                            userTimezone={clock.userTimezone}
                            onDeleteClick={handleDeleteClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default App;