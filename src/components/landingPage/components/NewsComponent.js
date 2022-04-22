export const NewsComponent = () =>{
    return (
        <div className="container mt-5">
            <div className="card-group">
                <div className="card m-3">
                    <img src={require('../assets/imgs/noticia1.jpg')} className="card-img-top" alt="Noticia1"/>
                    <div className="card-body">
                        <div className="card-title">Noticia 1</div>
                            <p className="card-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui vero ullam quasi doloremque optio delectus ducimus fugit est, nihil laboriosam assumenda dignissimos beatae labore totam rerum, at ipsa quaerat numquam!</p>
                        </div>
                        <div className="card-footer">
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </div>
                    </div>
                <div className="card m-3">
                    <img src={require('../assets/imgs/noticia2.png')} className="card-img-top" alt="Noticia1"/>
                    <div className="card-body">
                        <div className="card-title">Noticia 2</div>
                            <p className="card-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui vero ullam quasi doloremque optio delectus ducimus fugit est, nihil laboriosam assumenda dignissimos beatae labore totam rerum, at ipsa quaerat numquam!</p>
                        </div>
                        <div className="card-footer">
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </div>
                    </div>
                        <div className="card m-3">
                            <img src={require('../assets/imgs/noticia3.jpg')} className="card-img-top" alt="Noticia1"/>
                                <div className="card-body">
                                    <div className="card-title">Noticia 3</div>
                                        <p className="card-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui vero ullam quasi doloremque optio delectus ducimus fugit est, nihil laboriosam assumenda dignissimos beatae labore totam rerum, at ipsa quaerat numquam!</p>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-muted">Last updated 3 mins ago</small>
                                    </div>
                                </div>
                            </div>
                        </div> 
    );
}
