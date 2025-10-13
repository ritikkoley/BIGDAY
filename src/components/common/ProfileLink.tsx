import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileLinkProps {
  userId: string;
  userName: string;
  userRole: 'student' | 'teacher' | 'admin';
  className?: string;
}

export const ProfileLink: React.FC<ProfileLinkProps> = ({
  userId,
  userName,
  userRole,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${userRole}/${userId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left ${className}`}
    >
      {userName}
    </button>
  );
};

export default ProfileLink;
