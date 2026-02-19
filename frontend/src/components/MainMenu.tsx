import { useState } from "react";
import { useTrail, animated, useSpring } from "@react-spring/web";
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

    const trail = useTrail(posts.length, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        delay: 400,
        config: { mass: 1, tension: 120, friction: 14 }
    });

    const sidebarSpring = useSpring({
        from: { opacity: 0, transform: 'translateX(-40px)' },
        to: { opacity: 1, transform: 'translateX(0px)' },
        delay: 200,
        config: { mass: 1, tension: 100, friction: 20 }
    });

    const headerSpring = useSpring({
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { mass: 1, tension: 120, friction: 20 }
    });

    const mapSpring = useSpring({
        from: { opacity: 0, transform: 'translateX(40px)' },
        to: { opacity: 1, transform: 'translateX(0px)' },
        delay: 300,
        config: { mass: 1, tension: 100, friction: 20 }
    });

    const avatarGlow = useSpring({
        loop: { reverse: true },
        from: { boxShadow: '0 4px 15px rgba(0,0,0,0.05), inset 0 0 0px rgba(255,255,255,0.2)' },
        to: { boxShadow: '0 4px 25px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.8)' },
        config: { duration: 2000 }
    });

    return (
        <div style={pageContainerStyle}>
            <animated.header style={{ ...navbarStyle, ...headerSpring }}>
                <h1 style={logoStyle}>SmartCity Connect</h1>
            </animated.header>

            <div style={mainContentStyle}>
                <animated.aside style={{ ...sidebarStyle, ...sidebarSpring }}>
                    <div style={profileSectionStyle}>
                        <animated.div style={{ ...avatarStyle, ...avatarGlow }}>
                            {user.username.charAt(0).toUpperCase()}
                        </animated.div>
                        <h2 style={usernameStyle}>{user.username}</h2>
                        <p style={userInfoStyle}>Citizen • {user.email}</p>

                        <button onClick={onLogout} style={logoutButtonStyle}>
                            Sign Out
                        </button>
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
                </animated.aside>

                <main style={feedStyle}>
                    <div style={createPostCardStyle}>
                        <div style={postInputContainerStyle}>
                            <animated.div style={{ ...smallAvatarStyle, ...avatarGlow }}>
                                {user.username.charAt(0).toUpperCase()}
                            </animated.div>
                            <textarea
                                placeholder={`What did you visit recently ${user.username}?`}
                                style={textAreaStyle}
                            />
                        </div>
                        <div style={postActionContainerStyle}>
                            <button style={postButtonStyle}>Post</button>
                        </div>
                    </div>

                    <div style={postListStyle}>
                        {trail.map((style, index) => (
                            <animated.div key={posts[index].id} style={{ ...postCardStyle, ...style }}>
                                <div style={postHeaderStyle}>
                                    <animated.div style={{ ...smallAvatarStyle, ...avatarGlow }}>
                                        {posts[index].author.charAt(0)}
                                    </animated.div>
                                    <div>
                                        <strong style={postAuthorStyle}>{posts[index].author}</strong>
                                        <span style={postTimeStyle}>{posts[index].time}</span>
                                    </div>
                                </div>
                                <p style={postContentStyle}>{posts[index].content}</p>
                                <div style={postActionsStyle}>
                                    <span style={actionItemStyle}>❤️ {posts[index].likes} Likes</span>
                                    <span style={actionItemStyle}>💬 Comment</span>
                                    <span style={actionItemStyle}>🔁 Share</span>
                                </div>
                            </animated.div>
                        ))}
                    </div>
                </main>

                <animated.aside style={{ ...mapContainerStyle, ...mapSpring }}>
                    <iframe
                        title="SmartCity Map"
                        src="https://maps.google.com/maps?q=city+center&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </animated.aside>
            </div>
        </div>
    );
}

const pageContainerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    color: '#1a1a1a',
    textAlign: 'left' as const,
    backgroundImage: 'radial-gradient(circle at 50% 0%, #e8ecf1 0%, #f0f2f5 100%)'
};

const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
};

const logoStyle = {
    margin: 0,
    fontSize: '1.4rem',
    color: '#111',
    fontWeight: 800,
    letterSpacing: '-0.5px'
};

const mainContentStyle = {
    display: 'flex',
    maxWidth: '1400px',
    margin: '30px auto',
    gap: '30px',
    padding: '0 20px',
    alignItems: 'flex-start'
};

const sidebarStyle = {
    width: '280px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    flexShrink: 0
};

const profileSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: '30px 25px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255,255,255,0.6)',
    textAlign: 'center' as const
};

const avatarStyle = {
    width: '85px',
    height: '85px',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    color: '#111',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.2rem',
    margin: '0 auto',
    fontWeight: 700
};

const usernameStyle = {
    margin: '15px 0 5px 0',
    fontSize: '1.25rem',
    fontWeight: 700
};

const userInfoStyle = {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
};

const logoutButtonStyle = {
    width: '100%',
    marginTop: '25px',
    padding: '12px 20px',
    background: '#111',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    transition: 'background 0.3s ease, transform 0.2s ease'
};

const trendingSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255,255,255,0.6)'
};

const trendingTitleStyle = {
    fontSize: '1.05rem',
    marginTop: 0,
    marginBottom: '15px',
    fontWeight: 700
};

const trendingListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
};

const trendingItemStyle = {
    color: '#444',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem'
};

const feedStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    minWidth: '400px'
};

const createPostCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255,255,255,0.6)'
};

const postInputContainerStyle = {
    display: 'flex',
    gap: '15px'
};

const smallAvatarStyle = {
    width: '45px',
    height: '45px',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    color: '#111',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0,
    fontSize: '1.1rem'
};

const textAreaStyle = {
    flex: 1,
    border: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    padding: '15px',
    resize: 'none' as const,
    minHeight: '50px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s ease, background 0.3s ease'
};

const postActionContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '15px'
};

const postButtonStyle = {
    padding: '10px 24px',
    backgroundColor: '#111',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.5px'
};

const postListStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
};

const postCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255,255,255,0.6)'
};

const postHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
};

const postAuthorStyle = {
    display: 'block',
    fontWeight: 700,
    fontSize: '1rem',
    color: '#111'
};

const postTimeStyle = {
    color: '#888',
    fontSize: '0.85rem'
};

const postContentStyle = {
    margin: '0 0 20px 0',
    lineHeight: '1.6',
    color: '#333',
    fontSize: '0.95rem'
};

const postActionsStyle = {
    borderTop: '1px solid rgba(0,0,0,0.05)',
    paddingTop: '15px',
    color: '#555',
    fontSize: '0.9rem',
    display: 'flex',
    gap: '25px'
};

const actionItemStyle = {
    cursor: 'pointer',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
};

const mapContainerStyle = {
    width: '350px',
    flexShrink: 0,
    height: 'calc(100vh - 120px)',
    position: 'sticky' as const,
    top: '90px',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
    border: '1px solid rgba(255,255,255,0.6)',
    overflow: 'hidden'
};