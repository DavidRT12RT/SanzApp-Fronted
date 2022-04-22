import './InformationComponent.css';
export const InformationComponent = () =>{

    return (
        <div className="container mt-5">
            <div className="card mb-3 shadow">
                <div className="row g-0">
                  <div className="col-12 col-md-6 bg-trainer"></div>
                  <div className="col-12 col-md-6 bg-paper p-5">
                      <div className="card-body">
                          <div className="d-flex justify-content-center">
                              <img src={require('../assets/imgs/logoSanz.png')} alt="logo sanz" width="200"/></div>
                                <p className="card-text text-dark mt-2 fs-6 text-center">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias, necessitatibus, fugiat delectus in veniam nam asperiores numquam ratione esse officia iste modi voluptatibus at placeat velit repudiandae magnam adipisci provident?
        Voluptate reiciendis in cupiditate eos laborum mollitia necessitatibus praesentium animi autem explicabo, cumque fuga quae, ipsam nesciunt inventore.</p>
                              <div className="d-grid gap-2">
                                  <button className="btn btn-warning mt-3">Conocer mas!</button>
                              </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>     
    )
}
