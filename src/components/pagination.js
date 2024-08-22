import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageNumbersToShow = 5;
    const [pageStart, setPageStart] = React.useState(1);

    const handlePrev = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    const handleEllipsisClick = () => {
        const newStart = pageStart + maxPageNumbersToShow;
        if (newStart <= totalPages) {
            setPageStart(newStart);
            paginate(newStart);
        }
    };

    const visiblePageNumbers = [];
    const pageEnd = Math.min(pageStart + maxPageNumbersToShow - 1, totalPages);

    if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            visiblePageNumbers.push(i);
        }
    } else if (currentPage > 3 && currentPage < totalPages - 2) {
        visiblePageNumbers.push(1);
        visiblePageNumbers.push(2);
        visiblePageNumbers.push('...');
        visiblePageNumbers.push(currentPage - 1);
        visiblePageNumbers.push(currentPage);
        visiblePageNumbers.push(currentPage + 1);
        visiblePageNumbers.push('...');
        visiblePageNumbers.push(totalPages - 1);
        visiblePageNumbers.push(totalPages);
    } else {
        visiblePageNumbers.push(1);
        visiblePageNumbers.push(2);
        visiblePageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
            visiblePageNumbers.push(i);
        }
    }

    return (
        <nav>
            <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a onClick={handlePrev} href='#!' className='page-link'>
                        Prev
                    </a>
                </li>

                {visiblePageNumbers.map((number, index) => (
                    <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        {typeof number === 'number' ? (
                            <a onClick={() => paginate(number)} href='#!' className='page-link'>
                                {number}
                            </a>
                        ) : (
                            <span className='page-link'>{number}</span>
                        )}
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a onClick={handleNext} href='#!' className='page-link'>
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;

// import React from 'react';

// const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <nav>
//       <ul className="pagination">
//         {pageNumbers.map(number => (
//           <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
//             <a onClick={() => paginate(number)} href="#!" className="page-link">
//               {number}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Pagination;



