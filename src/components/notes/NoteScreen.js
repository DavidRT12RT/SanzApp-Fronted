import {NotesAppBar} from "./NotesAppBar"

export const NoteScreen = ()=>{
    return (
        <div className="notes__main-content">
            <NotesAppBar />
            <div className="notes__content">
                <input 
                    type="text"
                    placeholder="Some awesome title"
                    className="notes__title-input"
                />
                <textarea 
                    placeholder="What happenend today"
                    className="notes__textarea">
                </textarea>
                <div className="notes__image">
                    <img 
                        src='https://www.ngenespanol.com/wp-content/uploads/2018/08/La-primera-imagen-de-la-historia.jpg'
                        alt="imagen"
                        width="600px"
                     />
                </div>
                    
            </div>
        </div>
    )
}
