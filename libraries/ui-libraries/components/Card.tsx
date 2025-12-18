import type { CardProps } from "../../common-data-types/types";

export default function Card({
  img,
  title,
  style,
  content,
  className,
  actions,
  imgClassName,
  titleClassName,
  contentClassName,
  actionsClassName,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}: CardProps) {
  return (
    <div
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {img && <img src={img} alt={title} className={imgClassName} />}
      {title && <h5 className={titleClassName}>{title}</h5>}
      {content && <p className={contentClassName}>{content}</p>}
      {children}
      {actions && actions.length === 1 && (
        <button className={actions[0]?.className} onClick={actions[0]?.onClick}>
          {actions[0].label}
        </button>
      )}
      {actions && actions.length > 1 && (
        <div className={actionsClassName}>
          {actions.map((action, index) => (
            <button
              key={index}
              className={action?.className}
              onClick={action?.onClick}
            >
              {action?.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
