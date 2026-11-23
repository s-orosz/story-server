import type { Character } from "../story/types";

type ProfilePanelProps = {
  characters: Character[];
};

function ProfilePanel({ characters }: ProfilePanelProps) {
  return (
    <aside
      className="member-sidebar"
      aria-labelledby="members-title"
    >
      <h2 id="members-title" className="section-label">
        Characters — {characters.length}
      </h2>

      <ul className="member-list">
        {characters.map((character) => (
          <li className="member" key={character.id}>
            <div
              className={`avatar avatar-${character.id}`}
              aria-hidden="true"
            >
              {character.initials}
            </div>

            <div>
              <p className="member-name">{character.name}</p>
              <p className="member-role">{character.role}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="fiction-note">
        A fictional server. All conversations are part of the story.
      </p>
    </aside>
  );
}

export default ProfilePanel;