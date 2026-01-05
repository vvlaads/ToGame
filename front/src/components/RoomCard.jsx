import './styles/RoomCard.css';

function RoomCard({ room, onClick }) {
    return (
        <div onClick={onClick}>
            {room.name}
        </div>
    );
}

export default RoomCard;