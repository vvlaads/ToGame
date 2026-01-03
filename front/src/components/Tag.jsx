import './styles/Tag.css'

function Tag({ tag }) {
    return (
        <div className="tag__container">
            {tag.name}
        </div>
    )
}

export default Tag;