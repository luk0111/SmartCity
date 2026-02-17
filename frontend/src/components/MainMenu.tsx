import { useState } from "react";
import { type UserData } from "../App";

interface MainMenuProps {
    user: UserData;
    onLogout: () => void;
}

export default function MainMenu({ user, onLogout }: MainMenuProps) {
    const [posts] = useState([
        { id: 1, author: "City Council", content: "The new downtown park is officially open! Join us this weekend for live music and food trucks. 🌳🎸", likes: 120, time: "2h ago" },
        { id: 2, author: "Traffic Dept", content: "Avoid Main St today, heavy traffic due to roadworks near the central intersection. 🚧", likes: 15, time: "4h ago" },
        { id: 3, author: "Sarah Jenkins", content: "Anyone want to join the community neighborhood cleanup this Saturday morning? We're meeting at the plaza!", likes: 45, time: "5h ago" },
    ]);

    return (
        <div style={pageContainerStyle}>
            <header style={navbarStyle}>
                <h1 style={logoStyle}>SmartCity Connect</h1>
                <button onClick={onLogout} style={logoutButtonStyle}>Logout</button>
            </header>

            <div style={mainContentStyle}>
                <aside style={sidebarStyle}>
                    <div style={profileSectionStyle}>
                        <div style={avatarStyle}>{user.username.charAt(0).toUpperCase()}</div>
                        <h2 style={usernameStyle}>{user.username}</h2>
                        <p style={userInfoStyle}>Citizen • {user.email}</p>
                    </div>

                    <div style={trendingSectionStyle}>
                        <h3 style={trendingTitleStyle}>Trending in Your City</h3>
                        <ul style={trendingListStyle}>
                            <li style={trendingItemStyle}>#DowntownPark</li>
                            <li style={trendingItemStyle}>#TrafficUpdate</li>
                            <li style={trendingItemStyle}>#CommunityCleanup</li>
                            <li style={trendingItemStyle}>#CityElections</li>
                        </ul>
                    </div>
                </aside>

                <main style={feedStyle}>
                    <div style={createPostCardStyle}>
                        <div style={postInputContainerStyle}>
                            <div style={smallAvatarStyle}>{user.username.charAt(0).toUpperCase()}</div>
                            <textarea
                                placeholder={`What's happening in your neighborhood, ${user.username}?`}
                                style={textAreaStyle}
                            />
                        </div>
                        <div style={postActionContainerStyle}>
                            <button style={postButtonStyle}>Post</button>
                        </div>
                    </div>

                    <div style={postListStyle}>
                        {posts.map(post => (
                            <div key={post.id} style={postCardStyle}>
                                <div style={postHeaderStyle}>
                                    <div style={smallAvatarStyle}>{post.author.charAt(0)}</div>
                                    <div>
                                        <strong style={postAuthorStyle}>{post.author}</strong>
                                        <span style={postTimeStyle}>{post.time}</span>
                                    </div>
                                </div>
                                <p style={postContentStyle}>{post.content}</p>
                                <div style={postActionsStyle}>
                                    <span style={actionItemStyle}>❤️ {post.likes} Likes</span>
                                    <span style={actionItemStyle}>💬 Comment</span>
                                    <span style={actionItemStyle}>🔁 Share</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

const pageContainerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    color: '#1a1a1a',
    textAlign: 'left' as const
};

const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 40px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100
};

const logoStyle = {
    margin: 0,
    fontSize: '1.5rem',
    color: '#646cff'
};

const logoutButtonStyle = {
    padding: '8px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold' as const
};

const mainContentStyle = {
    display: 'flex',
    maxWidth: '1000px',
    margin: '20px auto',
    gap: '20px',
    padding: '0 20px'
};

const sidebarStyle = {
    width: '300px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
};

const profileSectionStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
};

const avatarStyle = {
    width: '80px',
    height: '80px',
    backgroundColor: '#646cff',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto',
    fontWeight: 'bold' as const
};

const usernameStyle = {
    margin: '10px 0 5px 0',
    fontSize: '1.2rem'
};

const userInfoStyle = {
    margin: 0,
    color: '#888',
    fontSize: '0.9rem'
};

const trendingSectionStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
};

const trendingTitleStyle = {
    fontSize: '1rem',
    marginTop: 0
};

const trendingListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
};

const trendingItemStyle = {
    color: '#646cff',
    cursor: 'pointer',
    fontWeight: 'bold' as const
};

const feedStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
};

const createPostCardStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
};

const postInputContainerStyle = {
    display: 'flex',
    gap: '10px'
};

const smallAvatarStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: '#646cff',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold' as const,
    flexShrink: 0
};

const textAreaStyle = {
    flex: 1,
    border: 'none',
    backgroundColor: '#f0f2f5',
    borderRadius: '20px',
    padding: '10px 15px',
    resize: 'none' as const,
    minHeight: '40px',
    fontFamily: 'inherit'
};

const postActionContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px'
};

const postButtonStyle = {
    padding: '8px 20px',
    backgroundColor: '#646cff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold' as const
};

const postListStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
};

const postCardStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
};

const postHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
};

const postAuthorStyle = {
    display: 'block'
};

const postTimeStyle = {
    color: '#888',
    fontSize: '0.8rem'
};

const postContentStyle = {
    margin: '0 0 15px 0',
    lineHeight: '1.5'
};

const postActionsStyle = {
    borderTop: '1px solid #eee',
    paddingTop: '10px',
    color: '#666',
    fontSize: '0.9rem',
    display: 'flex',
    gap: '20px'
};

const actionItemStyle = {
    cursor: 'pointer'
};