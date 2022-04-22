export const JournalEntry = () =>{
    return (
        <div className="journal__entry">
           <div className="journal__entry-picture cursor" 
            style={{
                backgroundSize:'cover',
                backgroundImage:'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png")',
            }}>
            </div>
            <div className="journal__entry-body">
                <p className="journal__entry-title">Un nuevo dia</p>
                <p className="journal__entry-content">Esta es una linea de purbea que yo mismo me estoy inventando ahorita mismo </p>
            </div> 
            <div className="journal__entry-date-box">
                <span>Monday</span>
           </div>
        </div>
    )
}
