interface UnreadBadgeProps {
  count: number;
}

export function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count === 0) return null;

  return (
    <span
      style={{
        background: '#d64545',
        color: 'white',
        borderRadius: 999,
        padding: '2px 10px',
        fontSize: 13,
        fontWeight: 600,
      }}
      data-testid="unread-badge"
    >
      {count} unread
    </span>
  );
}
