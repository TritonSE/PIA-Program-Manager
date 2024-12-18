export const TruncateDocument = ({
  documentName,
  documentLength,
}: {
  documentName: string;
  documentLength: number;
}) => {
  const minLength = 9; // Shortest truncation
  const maxLength = 20; // Longest truncation
  const extension = documentName.split(".").pop();
  const baseName = documentName.slice(0, documentName.lastIndexOf("."));

  // Use an inverse relationship: fewer documents = longer names
  const dynamicLength = Math.max(
    minLength,
    Math.min(maxLength, 20 - Math.floor((documentLength - 1) * 2)),
  );

  // Only truncate and add ellipsis if the basename is longer than dynamicLength
  const displayName =
    baseName.length > dynamicLength ? baseName.substring(0, dynamicLength) + "..." : baseName;

  return (
    <div className="grid">
      <span>{displayName}</span>
      <span className="text-sm text-gray-500">{extension?.toUpperCase()}</span>
    </div>
  );
};
