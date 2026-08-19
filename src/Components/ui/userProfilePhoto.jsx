export default function UserProfilePhoto({ userName }) {
    if (!userName) return null;
    
    const encodedName = encodeURIComponent(userName);
    
    return (
        <div className="flex items-center gap-2">
        <img
            src={`https://ui-avatars.com/api/?name=${encodedName}&background=random`}
            alt={userName}
            className="w-10 h-10 rounded-full"
        />
        </div>
    );
}