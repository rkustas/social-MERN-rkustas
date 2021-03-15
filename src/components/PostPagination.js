import React from "react";

const PostPagination = ({ page, setPage, postCount }) => {
  let totalPages;
  const pagination = () => {
    // total pages
    totalPages = Math.ceil(postCount && postCount.totalPosts / 6);
    // Limit number of pages shown
    if (totalPages > 10) {
      totalPages = 10;
    }
    // Display numbers array
    let pages = [];
    for (let index = 1; index <= totalPages; index++) {
      // Each time we push in a link
      pages.push(
        <li>
          <a
            className={`page-link ${page === index && "activePagination"}`}
            onClick={() => setPage(index)}
          >
            {index}
          </a>
        </li>
      );
    }
    return pages;
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li>
          <a
            className={`page-link ${page === 1 && "disabled"}`}
            onClick={() => setPage(1)}
          >
            Previous
          </a>
        </li>
        {pagination()}
        <li>
          <a
            className={`page-link ${page === totalPages && "disabled"}`}
            onClick={() => setPage(totalPages)}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PostPagination;
