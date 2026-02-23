"use client";

import { SlideContent } from "@/lib/slides";
import { Theme } from "@/lib/themes";

interface SlideProps {
  slide: SlideContent;
  theme: Theme;
  editable?: boolean;
  onUpdate?: (slideId: string, field: string, value: string) => void;
  scale?: number;
}

function EditableText({
  value,
  slideId,
  field,
  editable,
  onUpdate,
  className,
  style,
  tag: Tag = "div",
}: {
  value: string;
  slideId: string;
  field: string;
  editable?: boolean;
  onUpdate?: (slideId: string, field: string, value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tag?: "h1" | "h2" | "h3" | "p" | "div" | "span" | "li";
}) {
  if (!editable) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  return (
    <Tag
      className={`${className} outline-none cursor-text hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const newValue = (e.target as HTMLElement).innerText;
        if (newValue !== value && onUpdate) {
          onUpdate(slideId, field, newValue);
        }
      }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

/** Slide number badge - bottom right of every slide */
function SlideNumber({ num, color }: { num: number; color: string }) {
  return (
    <span
      className="absolute bottom-3 right-4 text-[10px] font-medium tracking-wide"
      style={{ color, opacity: 0.4 }}
    >
      {num}
    </span>
  );
}

/** Short accent bar under a title */
function AccentBar({ color, className = "" }: { color: string; className?: string }) {
  return (
    <div
      className={`h-[3px] w-10 rounded-full ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}

/** Footnote / note block used consistently */
function NoteBlock({
  value, slideId, field, editable, onUpdate, bg, fg,
}: {
  value: string; slideId: string; field: string;
  editable?: boolean; onUpdate?: (slideId: string, field: string, value: string) => void;
  bg: string; fg: string;
}) {
  return (
    <div className="mt-auto px-4 py-2.5 rounded-md text-[11px] leading-relaxed" style={{ backgroundColor: bg, color: fg }}>
      <EditableText
        value={value}
        slideId={slideId}
        field={field}
        editable={editable}
        onUpdate={onUpdate}
        tag="span"
        className=""
      />
    </div>
  );
}

/** Parse a two-column text block with section headers + bullet lines */
function ColumnContent({
  text, slideId, field, editable, onUpdate, accentColor, headingColor, textColor,
}: {
  text: string; slideId: string; field: string;
  editable?: boolean; onUpdate?: (slideId: string, field: string, value: string) => void;
  accentColor: string; headingColor: string; textColor: string;
}) {
  if (editable) {
    return (
      <EditableText
        value={text}
        slideId={slideId}
        field={field}
        editable={editable}
        onUpdate={onUpdate}
        tag="div"
        className="text-sm leading-relaxed whitespace-pre-line"
      />
    );
  }

  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        // Section header (ALL CAPS line)
        if (/^[A-Z][A-Z\s&/]+$/.test(trimmed)) {
          return (
            <p key={i} className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor }}>
              {trimmed}
            </p>
          );
        }
        // Bullet line
        if (trimmed.startsWith("•") || trimmed.startsWith("- ")) {
          const content = trimmed.replace(/^[•\-]\s*/, "");
          return (
            <div key={i} className="flex items-start gap-2 text-[13px] leading-snug mb-0.5">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
              <span style={{ color: textColor }}>{content}</span>
            </div>
          );
        }
        return <p key={i} className="text-[13px] leading-snug" style={{ color: textColor }}>{trimmed}</p>;
      })}
    </div>
  );
}

// ---- CONSISTENT TYPE SCALE ----
// H1 (slide title):     text-[22px] font-bold  — used on all content slides
// H1 (title/dict):      text-6xl / text-5xl    — only title & dictionary layouts
// Subtitle:             text-xs                 — slide subtitle line
// Body:                 text-[14px]             — paragraphs, bullets, table cells
// Caption / footnote:   text-[11px]             — notes, labels, fine print
// Section label:        text-[10px] uppercase   — column headers, section labels

export default function Slide({ slide, theme, editable, onUpdate, scale = 1 }: SlideProps) {
  const t = theme.colors;

  const baseStyle: React.CSSProperties = {
    backgroundColor: t.bg,
    color: t.text,
    fontFamily: theme.bodyFont,
    width: 960,
    height: 540,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    overflow: "hidden",
    position: "relative",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: theme.headingFont,
    color: t.heading,
  };

  const subtitleStyle: React.CSSProperties = {
    color: t.subtitle,
  };

  // ---- DICTIONARY LAYOUT ----
  if (slide.layout === "dictionary") {
    return (
      <div style={baseStyle} className="flex flex-col justify-center px-24 py-16">
        <div className="mb-1">
          <EditableText
            value={slide.title}
            slideId={slide.id}
            field="title"
            editable={editable}
            onUpdate={onUpdate}
            tag="h1"
            className="text-6xl font-bold"
            style={{ ...headingStyle, letterSpacing: "-0.02em" }}
          />
        </div>
        {slide.subtitle && (
          <EditableText
            value={slide.subtitle}
            slideId={slide.id}
            field="subtitle"
            editable={editable}
            onUpdate={onUpdate}
            tag="div"
            className="mb-4 text-xl"
            style={{ color: t.subtitle, fontFamily: "monospace" }}
          />
        )}
        {slide.body && (
          <EditableText
            value={slide.body}
            slideId={slide.id}
            field="body"
            editable={editable}
            onUpdate={onUpdate}
            tag="div"
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: t.accent }}
          />
        )}
        {slide.customHtml && (
          <div className="border-t pt-4" style={{ borderColor: t.tableBorder }}>
            <EditableText
              value={slide.customHtml}
              slideId={slide.id}
              field="customHtml"
              editable={editable}
              onUpdate={onUpdate}
              tag="p"
              className="text-xl leading-relaxed"
              style={{ color: t.text }}
            />
          </div>
        )}
        {slide.note && (
          <div className="mt-6 text-sm" style={{ color: t.subtitle }}>
            <EditableText
              value={slide.note}
              slideId={slide.id}
              field="note"
              editable={editable}
              onUpdate={onUpdate}
              tag="span"
              className="italic"
            />
          </div>
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- BAR CHART LAYOUT ----
  if (slide.layout === "bar-chart" && slide.bars) {
    const maxVal = Math.max(...slide.bars.map(b => b.value));
    return (
      <div style={baseStyle} className="flex flex-col p-10">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1"
          style={headingStyle}
        />
        {slide.subtitle && (
          <EditableText
            value={slide.subtitle}
            slideId={slide.id}
            field="subtitle"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="text-xs mb-1"
            style={{ color: t.subtitle }}
          />
        )}
        <AccentBar color={t.accent} className="mb-4" />
        <div className="flex-1 flex flex-col justify-center gap-[7px]">
          {slide.bars.map((bar, i) => (
            <div key={i} className="flex items-center gap-3">
              <EditableText
                value={bar.label}
                slideId={slide.id}
                field={`bars.${i}.label`}
                editable={editable}
                onUpdate={onUpdate}
                tag="span"
                className="text-[11px] text-right flex-shrink-0"
                style={{ width: 120, color: bar.highlight ? t.heading : t.text, fontWeight: bar.highlight ? 700 : 400 }}
              />
              <div className="flex-1 h-[22px] rounded-sm overflow-hidden" style={{ backgroundColor: t.cardBg }}>
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: `${(bar.value / maxVal) * 100}%`,
                    backgroundColor: bar.highlight ? t.accent : t.subtitle,
                    opacity: bar.highlight ? 1 : 0.45,
                  }}
                />
              </div>
              <span
                className="text-[13px] flex-shrink-0 tabular-nums"
                style={{ width: 48, color: bar.highlight ? t.accent : t.subtitle, fontWeight: bar.highlight ? 700 : 400 }}
              >
                {maxVal <= 50 ? "$" : ""}{bar.value % 1 === 0 ? bar.value : bar.value.toFixed(1)}{maxVal > 50 ? "%" : "T"}
              </span>
            </div>
          ))}
        </div>
        {slide.note && (
          <NoteBlock value={slide.note} slideId={slide.id} field="note" editable={editable} onUpdate={onUpdate} bg={t.noteBg} fg={t.noteText} />
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- TEAM LAYOUT ----
  if (slide.layout === "team" && slide.team) {
    const isLargeTeam = slide.team.length > 3;
    return (
      <div style={baseStyle} className={`flex flex-col items-center justify-center ${isLargeTeam ? "px-8 py-8" : "p-12"}`}>
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className={`font-bold ${isLargeTeam ? "text-[22px] mb-1" : "text-3xl mb-2"} text-center w-full`}
          style={headingStyle}
        />
        <AccentBar color={t.accent} className={`mx-auto ${isLargeTeam ? "mb-5" : "mb-6"}`} />
        <div className={`flex ${isLargeTeam ? "gap-3" : "gap-6"} items-stretch w-full`}>
          {slide.team.map((member, i) => (
            <div
              key={i}
              className={`flex-1 flex flex-col items-center text-center ${isLargeTeam ? "px-3 py-4" : "p-4"} rounded-lg`}
              style={{ backgroundColor: t.cardBg }}
            >
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className={`${isLargeTeam ? "w-14 h-14 mb-2" : "w-20 h-20 mb-4"} rounded-full object-cover`}
                  style={{ border: `2px solid ${t.accent}30` }}
                />
              ) : (
                <div
                  className={`${isLargeTeam ? "w-14 h-14 mb-2 text-lg" : "w-20 h-20 mb-4 text-2xl"} rounded-full flex items-center justify-center font-bold`}
                  style={{ backgroundColor: t.accent, color: t.bg }}
                >
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
              )}
              <EditableText
                value={member.name}
                slideId={slide.id}
                field={`team.${i}.name`}
                editable={editable}
                onUpdate={onUpdate}
                tag="h3"
                className={`${isLargeTeam ? "text-[13px]" : "text-lg"} font-bold mb-0.5`}
                style={{ color: t.heading }}
              />
              <EditableText
                value={member.role}
                slideId={slide.id}
                field={`team.${i}.role`}
                editable={editable}
                onUpdate={onUpdate}
                tag="p"
                className={`${isLargeTeam ? "text-[10px]" : "text-xs"} font-semibold uppercase tracking-wider mb-2`}
                style={{ color: t.accent }}
              />
              {editable ? (
                <EditableText
                  value={member.bio}
                  slideId={slide.id}
                  field={`team.${i}.bio`}
                  editable={editable}
                  onUpdate={onUpdate}
                  tag="p"
                  className={`${isLargeTeam ? "text-[9px] leading-snug" : "text-xs leading-relaxed"}`}
                  style={{ color: t.text, whiteSpace: "pre-line" }}
                />
              ) : (
                <div className="flex flex-col gap-0.5 w-full">
                  {member.bio.split("\n").map((line, li) => (
                    <p key={li} className={`${isLargeTeam ? "text-[9px]" : "text-xs"} leading-tight`}
                      style={{ color: t.text }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              {member.logos && member.logos.length > 0 && (
                <div className="flex justify-center gap-1 mt-auto pt-2">
                  {member.logos.map((logo, li) => (
                    <div
                      key={li}
                      className="flex items-center justify-center rounded"
                      style={{
                        width: isLargeTeam ? 44 : 52,
                        height: isLargeTeam ? 30 : 36,
                        backgroundColor: "#e8e8e8",
                        padding: "3px 4px",
                        flexShrink: 0,
                      }}
                      title={logo.name}
                    >
                      <img
                        src={logo.imageUrl}
                        alt={logo.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- FLOW LAYOUT ----
  if (slide.layout === "flow" && slide.flows) {
    const { before, middle, after, replacement } = slide.flows;
    return (
      <div style={baseStyle} className="flex flex-col p-10">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1 text-center"
          style={headingStyle}
        />
        <AccentBar color={t.accent} className="mx-auto mb-5" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {/* Flow row */}
          <div className="flex items-center gap-4 w-full justify-center">
            {/* Input box */}
            <div className="flex flex-col items-center gap-2 w-44">
              <div
                className="w-full rounded-xl p-4 flex flex-col items-center text-center"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.tableBorder}` }}
              >
                <span className="text-2xl mb-1">{before.icon}</span>
                <EditableText
                  value={before.label}
                  slideId={slide.id}
                  field="flows.before.label"
                  editable={editable}
                  onUpdate={onUpdate}
                  tag="span"
                  className="text-sm font-bold"
                  style={{ color: t.heading }}
                />
                {before.items.map((item, i) => (
                  <EditableText
                    key={i}
                    value={item}
                    slideId={slide.id}
                    field={`flows.before.items.${i}`}
                    editable={editable}
                    onUpdate={onUpdate}
                    tag="span"
                    className="text-xs mt-0.5"
                    style={{ color: t.subtitle }}
                  />
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-2xl font-bold" style={{ color: t.accent }}>&#x2192;</div>

            {/* Middle box (struck through) */}
            <div className="flex flex-col items-center gap-2 w-52 relative">
              <div
                className="w-full rounded-xl p-4 flex flex-col items-center text-center relative"
                style={{
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.tableBorder}`,
                  opacity: middle.strikethrough ? 0.45 : 1,
                }}
              >
                <span className="text-2xl mb-1">{middle.icon}</span>
                <EditableText
                  value={middle.label}
                  slideId={slide.id}
                  field="flows.middle.label"
                  editable={editable}
                  onUpdate={onUpdate}
                  tag="span"
                  className="text-sm font-bold"
                  style={{
                    color: t.heading,
                    textDecoration: middle.strikethrough ? "line-through" : "none",
                    textDecorationColor: t.accent,
                    textDecorationThickness: "2px",
                  }}
                />
              </div>
              {/* Replacement arrow + box */}
              {replacement && (
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold" style={{ color: t.accent }}>&#x2193;</div>
                  <div
                    className="w-full rounded-xl p-4 flex flex-col items-center text-center"
                    style={{
                      backgroundColor: t.accent + "18",
                      border: `2px solid ${t.accent}`,
                    }}
                  >
                    <span className="text-2xl mb-1">{replacement.icon}</span>
                    <EditableText
                      value={replacement.label}
                      slideId={slide.id}
                      field="flows.replacement.label"
                      editable={editable}
                      onUpdate={onUpdate}
                      tag="span"
                      className="text-sm font-bold"
                      style={{ color: t.accent }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="text-2xl font-bold" style={{ color: t.accent }}>&#x2192;</div>

            {/* Output box */}
            <div className="flex flex-col items-center gap-2 w-44">
              <div
                className="w-full rounded-xl p-4 flex flex-col items-center text-center"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.tableBorder}` }}
              >
                <span className="text-2xl mb-1">{after.icon}</span>
                <EditableText
                  value={after.label}
                  slideId={slide.id}
                  field="flows.after.label"
                  editable={editable}
                  onUpdate={onUpdate}
                  tag="span"
                  className="text-sm font-bold"
                  style={{ color: t.heading }}
                />
                {after.items.map((item, i) => (
                  <EditableText
                    key={i}
                    value={item}
                    slideId={slide.id}
                    field={`flows.after.items.${i}`}
                    editable={editable}
                    onUpdate={onUpdate}
                    tag="span"
                    className="text-xs mt-0.5"
                    style={{ color: t.subtitle }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {slide.note && (
          <NoteBlock value={slide.note} slideId={slide.id} field="note" editable={editable} onUpdate={onUpdate} bg={t.noteBg} fg={t.noteText} />
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- TITLE LAYOUT ----
  if (slide.layout === "title") {
    return (
      <div style={baseStyle} className="flex flex-col items-center justify-center p-16">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-6xl font-bold text-center mb-4"
          style={headingStyle}
        />
        {slide.subtitle && (
          <EditableText
            value={slide.subtitle}
            slideId={slide.id}
            field="subtitle"
            editable={editable}
            onUpdate={onUpdate}
            tag="h2"
            className="text-2xl text-center"
            style={subtitleStyle}
          />
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- BIG TEXT LAYOUT ----
  if (slide.layout === "big-text" || slide.layout === "section") {
    return (
      <div style={baseStyle} className="flex flex-col items-center justify-center p-16">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-5xl font-bold text-center"
          style={headingStyle}
        />
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- TEXT LAYOUT ----
  if (slide.layout === "text") {
    return (
      <div style={baseStyle} className="flex flex-col p-12">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1"
          style={headingStyle}
        />
        <AccentBar color={t.accent} className="mb-5" />
        {slide.body && (
          <EditableText
            value={slide.body}
            slideId={slide.id}
            field="body"
            editable={editable}
            onUpdate={onUpdate}
            tag="div"
            className="text-[14px] leading-[1.75] whitespace-pre-line"
          />
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- TWO-COLUMN LAYOUT ----
  if (slide.layout === "two-column") {
    return (
      <div style={baseStyle} className="flex flex-col p-10">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1"
          style={headingStyle}
        />
        <AccentBar color={t.accent} className="mb-5" />
        <div className="flex gap-5 flex-1">
          <div className="flex-1 px-4 py-3 rounded-lg" style={{ backgroundColor: t.cardBg }}>
            {slide.leftText && (
              <ColumnContent
                text={slide.leftText}
                slideId={slide.id}
                field="leftText"
                editable={editable}
                onUpdate={onUpdate}
                accentColor={t.accent}
                headingColor={t.heading}
                textColor={t.text}
              />
            )}
          </div>
          <div className="flex-1 px-4 py-3 rounded-lg" style={{ backgroundColor: t.cardBg }}>
            {slide.rightText && (
              <ColumnContent
                text={slide.rightText}
                slideId={slide.id}
                field="rightText"
                editable={editable}
                onUpdate={onUpdate}
                accentColor={t.accent}
                headingColor={t.heading}
                textColor={t.text}
              />
            )}
          </div>
        </div>
        {slide.note && (
          <NoteBlock value={slide.note} slideId={slide.id} field="note" editable={editable} onUpdate={onUpdate} bg={t.noteBg} fg={t.noteText} />
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- BULLETS LAYOUT ----
  if (slide.layout === "bullets") {
    return (
      <div style={baseStyle} className="flex flex-col p-10 px-12">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1"
          style={headingStyle}
        />
        <AccentBar color={t.accent} className="mb-4" />
        {slide.body && (
          <EditableText
            value={slide.body}
            slideId={slide.id}
            field="body"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="text-[14px] mb-5 leading-relaxed"
            style={{ color: t.text }}
          />
        )}
        {slide.bullets && (
          <ul className="space-y-2.5 ml-1">
            {slide.bullets.map((bullet, i) => {
              // Split on " — " to highlight the label portion
              const dashIdx = bullet.indexOf(" — ");
              const hasLabel = dashIdx > 0;
              return (
                <li key={i} className="flex items-start gap-3 text-[14px] leading-snug">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.accent }} />
                  {hasLabel && !editable ? (
                    <span>
                      <span className="font-semibold" style={{ color: t.heading }}>{bullet.slice(0, dashIdx)}</span>
                      <span style={{ color: t.subtitle }}> &mdash; {bullet.slice(dashIdx + 3)}</span>
                    </span>
                  ) : (
                    <EditableText
                      value={bullet}
                      slideId={slide.id}
                      field={`bullets.${i}`}
                      editable={editable}
                      onUpdate={onUpdate}
                      tag="span"
                      className=""
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {slide.note && (
          <NoteBlock value={slide.note} slideId={slide.id} field="note" editable={editable} onUpdate={onUpdate} bg={t.noteBg} fg={t.noteText} />
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- PARALLELS LAYOUT (side-by-side revolution comparison) ----
  if (slide.layout === "parallels" && slide.tableRows && slide.tableHeaders) {
    const leftLabel = slide.tableHeaders[1] || "";
    const rightLabel = slide.tableHeaders[2] || "";
    const rows = slide.tableRows;

    return (
      <div style={baseStyle} className="flex flex-col px-10 py-7">
        {/* Title & subtitle */}
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1"
          style={headingStyle}
        />
        {slide.subtitle && (
          <EditableText
            value={slide.subtitle}
            slideId={slide.id}
            field="subtitle"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="text-xs mb-1"
            style={subtitleStyle}
          />
        )}
        <AccentBar color={t.accent} className="mb-4" />

        {/* Comparison grid */}
        <div className="flex-1 flex flex-col">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_100px_1fr] gap-0 mb-2">
            <div className="rounded-lg py-2 text-center"
              style={{ backgroundColor: t.tableHeaderBg, border: `1px solid ${t.tableBorder}` }}>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: t.subtitle }}>
                {leftLabel}
              </span>
            </div>
            <div />
            <div className="rounded-lg py-2 text-center"
              style={{ backgroundColor: t.accent + "18", border: `1px solid ${t.accent}50` }}>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: t.accent }}>
                {rightLabel}
              </span>
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => {
            const isLast = i === rows.length - 1;
            const cat = row[0] || "";
            const leftVal = row[1] || "";
            const rightVal = row[2] || "";

            if (isLast) {
              return (
                <div key={i} className="grid grid-cols-[1fr_100px_1fr] mt-3 rounded-xl overflow-hidden"
                  style={{ backgroundColor: t.accent + "12", border: `2px solid ${t.accent}40` }}>
                  <div className="py-4 px-5 flex items-center justify-end">
                    <span className="text-xl font-bold" style={{ color: t.text }}>{leftVal}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[8px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: t.accent }}>{cat}</span>
                    <span className="text-xl font-bold" style={{ color: t.accent }}>&#x2192;</span>
                  </div>
                  <div className="py-4 px-5 flex items-center">
                    <span className="text-xl font-bold" style={{ color: t.accent }}>{rightVal}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="grid grid-cols-[1fr_100px_1fr]"
                style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
                <div className="py-2 px-5 flex items-center justify-end">
                  <span className="text-[15px]" style={{ color: t.text }}>{leftVal}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[8px] font-bold uppercase tracking-widest"
                    style={{ color: t.subtitle, opacity: 0.6 }}>{cat}</span>
                </div>
                <div className="py-2 px-5 flex items-center">
                  <span className="text-[15px]" style={{ color: t.text }}>{rightVal}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        {slide.note && (
          <div className="mt-3 px-3 py-2 rounded-md" style={{ backgroundColor: t.noteBg }}>
            <p className="text-[10px] leading-relaxed" style={{ color: t.noteText }}>{slide.note}</p>
          </div>
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- TABLE LAYOUT ----
  if (slide.layout === "table") {
    // Detect if the last row should be highlighted (competitive landscape "Cognitory" row)
    const lastRow = slide.tableRows?.[slide.tableRows.length - 1];
    const highlightLastRow = lastRow && lastRow[0]?.toLowerCase().includes("cognitory");

    return (
      <div style={baseStyle} className="flex flex-col p-10">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-[22px] font-bold mb-1"
          style={headingStyle}
        />
        {slide.subtitle && !slide.stats && (
          <>
            <EditableText
              value={slide.subtitle}
              slideId={slide.id}
              field="subtitle"
              editable={editable}
              onUpdate={onUpdate}
              tag="h2"
              className="text-sm mb-1"
              style={subtitleStyle}
            />
            <AccentBar color={t.accent} className="mb-3" />
          </>
        )}
        {!slide.subtitle && !slide.stats && (
          <AccentBar color={t.accent} className="mb-3" />
        )}
        {slide.stats && (
          <div className="flex gap-3 mb-3 mt-1">
            {slide.stats.map((stat, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg px-3 py-2 flex flex-col items-center justify-center text-center"
                style={{
                  backgroundColor: i === 0 ? t.accent + "15" : t.cardBg,
                  border: `1.5px solid ${i === 0 ? t.accent + "40" : t.tableBorder}`,
                }}
              >
                <span
                  className="text-lg font-bold leading-none"
                  style={{ color: i === 0 ? t.accent : t.heading, fontFamily: theme.headingFont }}
                >
                  {stat.value}
                </span>
                <span className="text-[8px] mt-1 uppercase tracking-wider font-medium" style={{ color: t.subtitle }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
        {slide.note && (
          <EditableText
            value={slide.note}
            slideId={slide.id}
            field="note"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="text-[11px] mb-2"
            style={{ color: t.subtitle }}
          />
        )}
        {slide.tableHeaders && slide.tableRows && (
          <div className="overflow-auto flex-1">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  {slide.tableHeaders.map((h, i) => (
                    <th
                      key={i}
                      className="px-2.5 py-2 text-left font-semibold border text-[11px]"
                      style={{
                        backgroundColor: t.tableHeaderBg,
                        borderColor: t.tableBorder,
                        color: t.heading,
                      }}
                    >
                      <EditableText
                        value={h}
                        slideId={slide.id}
                        field={`tableHeaders.${i}`}
                        editable={editable}
                        onUpdate={onUpdate}
                        tag="span"
                        className=""
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.tableRows.map((row, ri) => {
                  const isLast = ri === slide.tableRows!.length - 1;
                  const isHighlighted = isLast && highlightLastRow;
                  const isEven = ri % 2 === 0;
                  return (
                    <tr
                      key={ri}
                      style={{
                        backgroundColor: isHighlighted
                          ? t.accent + "15"
                          : isEven ? undefined : t.cardBg + "80",
                      }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-2.5 py-1.5 border"
                          style={{
                            borderColor: t.tableBorder,
                            fontWeight: isHighlighted ? 600 : undefined,
                            color: isHighlighted && ci === 0 ? t.accent : undefined,
                          }}
                        >
                          <EditableText
                            value={cell}
                            slideId={slide.id}
                            field={`tableRows.${ri}.${ci}`}
                            editable={editable}
                            onUpdate={onUpdate}
                            tag="span"
                            className={cell === "✓" ? "text-lg" : ""}
                            style={cell === "✓" ? { color: t.accent } : undefined}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <SlideNumber num={slide.number} color={t.subtitle} />
      </div>
    );
  }

  // ---- STACK LAYOUT (SVG Architecture Diagram) ----
  if (slide.layout === "stack" && slide.stack) {
    const W = 960, H = 540;
    const MARGIN = 28;
    const TITLE_H = 62;
    const ARROW_GAP = 10;

    const hasHoldco = slide.holdcoAgents && slide.holdcoAgents.length > 0;
    const COL_GAP = 20;
    const leftW = hasHoldco ? 540 : W - MARGIN * 2;
    const rightW = hasHoldco ? W - MARGIN * 2 - leftW - COL_GAP : 0;
    const rightX = MARGIN + leftW + COL_GAP;

    const layers = slide.stack;
    const numLayers = layers.length;
    const numArrowGaps = numLayers - 1;
    const totalDiagramH = H - TITLE_H - MARGIN;
    const layerH = (totalDiagramH - numArrowGaps * ARROW_GAP) / numLayers;
    const renderLayers = [...layers].reverse();

    return (
      <div style={baseStyle}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: theme.bodyFont }}>
          {/* Title */}
          <text x={MARGIN} y={28} fill={t.heading} fontSize={20} fontWeight="bold" fontFamily={theme.headingFont}>
            {slide.title}
          </text>
          {slide.subtitle && (
            <text x={MARGIN} y={45} fill={t.subtitle} fontSize={11}>
              {slide.subtitle}
            </text>
          )}
          {/* Accent bar */}
          <rect x={MARGIN} y={50} width={40} height={3} rx={1.5} fill={t.accent} />

          {/* Slide number */}
          <text x={W - 16} y={H - 8} textAnchor="end" fill={t.subtitle} fontSize={10} opacity={0.4}>
            {slide.number}
          </text>

          {/* === LEFT: Platform Stack === */}
          <text x={MARGIN + leftW / 2} y={TITLE_H - 2} textAnchor="middle"
            fill={t.subtitle} fontSize={9} fontWeight="bold" letterSpacing="0.1em">
            PORTFOLIO PLATFORM
          </text>

          {renderLayers.map((layer, li) => {
            const layerY = TITLE_H + li * (layerH + ARROW_GAP);
            const layerX = MARGIN;
            const items = layer.items || [];
            const innerPadTop = 22;
            const innerPadSide = 10;
            const innerH = layerH - innerPadTop - 6;

            if (layer.grid) {
              const cols = Math.min(items.length, hasHoldco ? 5 : 9);
              const boxGap = 5;
              const boxW = (leftW - innerPadSide * 2 - (cols - 1) * boxGap) / cols;
              const boxH = innerH - 2;
              const rows = Math.ceil(items.length / cols);

              return (
                <g key={li}>
                  <rect x={layerX} y={layerY} width={leftW} height={layerH} rx={6}
                    fill={t.cardBg} stroke={t.tableBorder} strokeWidth={1.5} />
                  <text x={layerX + innerPadSide} y={layerY + 15} fill={t.accent}
                    fontSize={9} fontWeight="bold" letterSpacing="0.08em">
                    {layer.icon} {layer.label.toUpperCase()}
                  </text>
                  {items.map((item, ii) => {
                    const col = ii % cols;
                    const row = Math.floor(ii / cols);
                    const bx = layerX + innerPadSide + col * (boxW + boxGap);
                    const rowH = rows > 1 ? (innerH - 2) / rows - 3 : boxH;
                    const by = layerY + innerPadTop + row * (rowH + 3);
                    const isAccent = item.accent;
                    return (
                      <g key={ii}>
                        <rect x={bx} y={by} width={boxW} height={rowH} rx={4}
                          fill={isAccent ? t.accent + "20" : t.bg}
                          stroke={isAccent ? t.accent + "80" : t.tableBorder}
                          strokeWidth={1}
                          strokeDasharray={!isAccent && item.icon === "🔵" ? "3,2" : undefined} />
                        <text x={bx + boxW / 2} y={by + rowH / 2 + 3} textAnchor="middle"
                          fill={isAccent ? t.accent : t.subtitle} fontSize={8}>
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            }

            const generalItems = items.filter(i => !i.accent);
            const domainItems = items.filter(i => i.accent);
            const hasTwo = domainItems.length > 0 && generalItems.length > 0;
            const groupGap = 10;
            const groupW = hasTwo ? (leftW - innerPadSide * 2 - groupGap) / 2 : leftW - innerPadSide * 2;

            return (
              <g key={li}>
                <rect x={layerX} y={layerY} width={leftW} height={layerH} rx={6}
                  fill={t.cardBg} stroke={t.tableBorder} strokeWidth={1.5} />
                <text x={layerX + innerPadSide} y={layerY + 15} fill={t.accent}
                  fontSize={9} fontWeight="bold" letterSpacing="0.08em">
                  {layer.icon} {layer.label.toUpperCase()}
                </text>

                {generalItems.length > 0 && (
                  <g>
                    <rect x={layerX + innerPadSide} y={layerY + innerPadTop}
                      width={groupW} height={innerH} rx={5}
                      fill={t.bg} stroke={t.tableBorder} strokeWidth={1} />
                    <text x={layerX + innerPadSide + 8} y={layerY + innerPadTop + 13}
                      fill={t.subtitle} fontSize={8} fontWeight="bold" letterSpacing="0.05em">
                      {hasTwo ? "GENERAL SKILLS" : "CAPABILITIES"}
                    </text>
                    {generalItems.map((item, ii) => {
                      const cols = hasTwo ? Math.min(generalItems.length, 2) : Math.min(generalItems.length, 4);
                      const row = Math.floor(ii / cols);
                      const col = ii % cols;
                      const bw = (groupW - 20) / cols - 3;
                      const bh = 20;
                      const bx = layerX + innerPadSide + 8 + col * (bw + 4);
                      const by = layerY + innerPadTop + 20 + row * (bh + 4);
                      return (
                        <g key={ii}>
                          <rect x={bx} y={by} width={bw} height={bh} rx={3}
                            fill={t.cardBg} stroke={t.tableBorder} strokeWidth={0.75} />
                          <text x={bx + bw / 2} y={by + bh / 2 + 3} textAnchor="middle"
                            fill={t.text} fontSize={8}>
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {domainItems.length > 0 && (
                  <g>
                    <rect x={layerX + innerPadSide + (hasTwo ? groupW + groupGap : 0)}
                      y={layerY + innerPadTop}
                      width={hasTwo ? groupW : leftW - innerPadSide * 2}
                      height={innerH} rx={5}
                      fill={t.accent + "10"} stroke={t.accent + "50"} strokeWidth={1} />
                    <text x={layerX + innerPadSide + (hasTwo ? groupW + groupGap : 0) + 8}
                      y={layerY + innerPadTop + 13}
                      fill={t.accent} fontSize={8} fontWeight="bold" letterSpacing="0.05em">
                      DOMAIN SKILLS (TPA)
                    </text>
                    {domainItems.map((item, ii) => {
                      const gx = layerX + innerPadSide + (hasTwo ? groupW + groupGap : 0);
                      const gw = hasTwo ? groupW : leftW - innerPadSide * 2;
                      const cols = hasTwo ? Math.min(domainItems.length, 2) : Math.min(domainItems.length, 3);
                      const row = Math.floor(ii / cols);
                      const col = ii % cols;
                      const bw = (gw - 20) / cols - 3;
                      const bh = 20;
                      const bx = gx + 8 + col * (bw + 4);
                      const by = layerY + innerPadTop + 20 + row * (bh + 4);
                      return (
                        <g key={ii}>
                          <rect x={bx} y={by} width={bw} height={bh} rx={3}
                            fill={t.accent + "20"} stroke={t.accent + "60"} strokeWidth={0.75} />
                          <text x={bx + bw / 2} y={by + bh / 2 + 3} textAnchor="middle"
                            fill={t.accent} fontSize={8}>
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}

          {/* Arrows between platform layers */}
          {renderLayers.slice(0, -1).map((_, li) => {
            const gapTop = TITLE_H + (li + 1) * layerH + li * ARROW_GAP;
            const gapMid = gapTop + ARROW_GAP / 2;
            const cx = MARGIN + leftW / 2;
            const chevronXs = [cx - 80, cx, cx + 80];
            return (
              <g key={`arrow-${li}`}>
                {chevronXs.map((ax, ai) => (
                  <g key={ai} opacity={0.5}>
                    <line x1={ax - 5} y1={gapMid - 3} x2={ax} y2={gapMid + 2}
                      stroke={t.accent} strokeWidth={1.5} strokeLinecap="round" />
                    <line x1={ax + 5} y1={gapMid - 3} x2={ax} y2={gapMid + 2}
                      stroke={t.accent} strokeWidth={1.5} strokeLinecap="round" />
                  </g>
                ))}
              </g>
            );
          })}

          {/* === RIGHT: Holdco AI Agents === */}
          {hasHoldco && slide.holdcoAgents && (() => {
            const agents = slide.holdcoAgents;
            const agentCount = agents.length;
            const colTopY = TITLE_H;
            const colH = totalDiagramH;
            const innerPad = 8;
            const cardGap = 4;
            const arrowH = 12;
            const usableH = colH - innerPad * 2;
            const cardH = (usableH - (agentCount - 1) * (cardGap + arrowH)) / agentCount;

            return (
              <g>
                <text x={rightX + rightW / 2} y={TITLE_H - 2} textAnchor="middle"
                  fill={t.subtitle} fontSize={9} fontWeight="bold" letterSpacing="0.1em">
                  HOLDCO AI AGENTS
                </text>

                <rect x={rightX} y={colTopY} width={rightW} height={colH} rx={8}
                  fill={t.accent + "06"} stroke={t.accent + "30"} strokeWidth={1.5}
                  strokeDasharray="6,3" />

                {agents.map((agent, ai) => {
                  const cy = colTopY + innerPad + ai * (cardH + cardGap + arrowH);
                  const innerW = rightW - innerPad * 2;
                  const cx = rightX + innerPad;

                  return (
                    <g key={ai}>
                      <rect x={cx} y={cy} width={innerW} height={cardH} rx={6}
                        fill={t.cardBg} stroke={t.accent + "60"} strokeWidth={1.5} />
                      <text x={cx + 10} y={cy + cardH * 0.45} fontSize={14} dominantBaseline="middle">
                        {agent.icon}
                      </text>
                      <text x={cx + 28} y={cy + cardH * 0.38} fill={t.heading}
                        fontSize={10} fontWeight="bold">
                        {agent.label}
                      </text>
                      {agent.description && (
                        <text x={cx + 28} y={cy + cardH * 0.7} fill={t.subtitle} fontSize={7}>
                          {agent.description.length > 50 ? agent.description.slice(0, 50) + "…" : agent.description}
                        </text>
                      )}
                      {ai < agentCount - 1 && (
                        <g>
                          <line x1={rightX + rightW / 2} y1={cy + cardH + 2}
                            x2={rightX + rightW / 2} y2={cy + cardH + cardGap + arrowH - 2}
                            stroke={t.accent} strokeWidth={1.5} opacity={0.5} />
                          <polygon
                            points={`${rightX + rightW / 2 - 4},${cy + cardH + cardGap + arrowH - 7} ${rightX + rightW / 2 + 4},${cy + cardH + cardGap + arrowH - 7} ${rightX + rightW / 2},${cy + cardH + cardGap + arrowH - 2}`}
                            fill={t.accent} opacity={0.5} />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })()}

        </svg>
      </div>
    );
  }

  // ---- FALLBACK ----
  return (
    <div style={baseStyle} className="flex flex-col items-center justify-center p-16">
      <h1 className="text-4xl font-bold" style={headingStyle}>{slide.title}</h1>
      <SlideNumber num={slide.number} color={t.subtitle} />
    </div>
  );
}
