import React, { useEffect, useState } from "react";

// Mengambil dan menampilkan daftar repositori GitHub.
// Mengambil dan menampilkan daftar repositori GitHub.
export function RepoSlides() {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(
      "https://api.github.com/users/yabiyabi127/repos?per_page=100&sort=updated",
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok)
          throw new Error("Repositori tidak dapat dimuat saat ini");
        return response.json();
      })
      .then((data) => setRepos(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });
    return () => controller.abort();
  }, []);
  if (error)
    return (
      <div className="repo-slide" role="status">
        {error}
      </div>
    );
  if (!repos.length)
    return (
      <div className="repo-slide" role="status">
        Loading public GitHub repositories...
      </div>
    );
  return repos.map((repo) => (
    <article className="repo-slide" key={repo.id}>
      <div className="repo">
        <span className="repo-badge">Public repository</span>
        <h3>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <p>{repo.description || "Tidak ada deskripsi."}</p>
        <div className="repo-footer">
          <small>
            ★ {repo.stargazers_count} · Forks: {repo.forks_count}
          </small>
          <a
            className="repo-open-link"
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open <i className="uil uil-arrow-up-right" />
          </a>
        </div>
      </div>
    </article>
  ));
}
