import Link from "next/link";

import "./index.css";

export function Header() {
  return (
    <div className="headerWrapper">
      <h1 className="noteHeader">Notes</h1>

      <Link href="/notes" className="primary-button">
        <a>View Your Notes</a>
      </Link>

      <Link href="/edit" className="primary-button">
        <a>+ Create A New Note</a>
      </Link>
    </div>
  );
}
