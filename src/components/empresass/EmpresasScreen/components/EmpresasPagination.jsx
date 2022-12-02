import React from 'react'

const EmpresasPagination = () => {

    const styles = {
        alignSelf:"end",
    };

    return (
        <nav aria-label="..." className="mt-3" style={styles}>
            <ul class="pagination pagination-lg">
                <li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">1</a></li>
                <li class="page-item"><a class="page-link text-warning" href="#">2</a></li>
                <li class="page-item"><a class="page-link text-warning" href="#">3</a></li>
            </ul>
        </nav>
    )
}


export default EmpresasPagination;