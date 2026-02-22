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
          className="text-2xl font-bold mb-1"
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
            className="text-sm mb-4"
            style={{ color: t.subtitle }}
          />
        )}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          {slide.bars.map((bar, i) => (
            <div key={i} className="flex items-center gap-3">
              <EditableText
                value={bar.label}
                slideId={slide.id}
                field={`bars.${i}.label`}
                editable={editable}
                onUpdate={onUpdate}
                tag="span"
                className="text-[10px] text-right flex-shrink-0"
                style={{ width: 110, color: bar.highlight ? t.heading : t.text, fontWeight: bar.highlight ? 700 : 400 }}
              />
              <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ backgroundColor: t.cardBg }}>
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: `${(bar.value / maxVal) * 100}%`,
                    backgroundColor: bar.highlight ? t.accent : t.subtitle,
                    opacity: bar.highlight ? 1 : 0.5,
                  }}
                />
              </div>
              <span
                className="text-xs flex-shrink-0"
                style={{ width: 48, color: bar.highlight ? t.accent : t.subtitle, fontWeight: bar.highlight ? 700 : 400 }}
              >
                {maxVal <= 50 ? "$" : ""}{bar.value % 1 === 0 ? bar.value : bar.value.toFixed(1)}{maxVal > 50 ? "%" : "T"}
              </span>
            </div>
          ))}
        </div>
        {slide.note && (
          <EditableText
            value={slide.note}
            slideId={slide.id}
            field="note"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="footnote mt-3"
            style={{ color: t.subtitle }}
          />
        )}
      </div>
    );
  }

  // ---- TEAM LAYOUT ----
  if (slide.layout === "team" && slide.team) {
    const isLargeTeam = slide.team.length > 3;
    return (
      <div style={baseStyle} className={`flex flex-col items-center justify-center ${isLargeTeam ? "px-10 py-10" : "p-12"}`}>
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className={`font-bold ${isLargeTeam ? "text-2xl mb-6" : "text-3xl mb-8"} text-center w-full`}
          style={headingStyle}
        />
        <div className={`flex ${isLargeTeam ? "gap-4" : "gap-6"} items-stretch w-full`}>
          {slide.team.map((member, i) => (
            <div
              key={i}
              className={`flex-1 flex flex-col items-center text-center ${isLargeTeam ? "px-4 py-5" : "p-4"} rounded-lg`}
              style={{ backgroundColor: t.cardBg }}
            >
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className={`${isLargeTeam ? "w-16 h-16 mb-3" : "w-20 h-20 mb-4"} rounded-full object-cover`}
                />
              ) : (
                <div
                  className={`${isLargeTeam ? "w-16 h-16 mb-3 text-xl" : "w-20 h-20 mb-4 text-2xl"} rounded-full flex items-center justify-center font-bold`}
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
                className={`${isLargeTeam ? "text-base" : "text-lg"} font-bold mb-1`}
                style={{ color: t.heading }}
              />
              <EditableText
                value={member.role}
                slideId={slide.id}
                field={`team.${i}.role`}
                editable={editable}
                onUpdate={onUpdate}
                tag="p"
                className={`${isLargeTeam ? "text-xs" : "text-sm"} font-semibold mb-2`}
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
                  className={`${isLargeTeam ? "text-[10px] leading-snug" : "text-xs leading-relaxed"}`}
                  style={{ color: t.text, whiteSpace: "pre-line" }}
                />
              ) : (
                <div className="flex flex-col gap-0.5 w-full">
                  {member.bio.split("\n").map((line, li) => (
                    <p key={li} className={`${isLargeTeam ? "text-[10px]" : "text-xs"} leading-tight`}
                      style={{ color: t.text }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              {member.logos && member.logos.length > 0 && (
                <div className="flex justify-center gap-2 mt-2">
                  {member.logos.map((logo, li) => (
                    <div
                      key={li}
                      className="flex items-center justify-center rounded"
                      style={{
                        width: 48,
                        height: 28,
                        backgroundColor: "#ffffff",
                        padding: "2px 4px",
                        flexShrink: 0,
                      }}
                      title={logo.name}
                    >
                      <img
                        src={logo.imageUrl}
                        alt={logo.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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
          className="text-2xl font-bold mb-6 text-center"
          style={headingStyle}
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {/* Flow row */}
          <div className="flex items-center gap-3 w-full justify-center">
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
            <div className="text-xl" style={{ color: t.subtitle }}>→</div>

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
                  <div className="text-lg" style={{ color: t.accent }}>↓</div>
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
            <div className="text-xl" style={{ color: t.subtitle }}>→</div>

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
          <div className="mt-auto p-3 rounded text-sm text-center" style={{ backgroundColor: t.noteBg, color: t.noteText }}>
            <EditableText
              value={slide.note}
              slideId={slide.id}
              field="note"
              editable={editable}
              onUpdate={onUpdate}
              tag="span"
              className=""
            />
          </div>
        )}
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
          className="text-3xl font-bold mb-6"
          style={headingStyle}
        />
        {slide.body && (
          <EditableText
            value={slide.body}
            slideId={slide.id}
            field="body"
            editable={editable}
            onUpdate={onUpdate}
            tag="div"
            className="text-lg leading-relaxed whitespace-pre-line"
          />
        )}
      </div>
    );
  }

  // ---- TWO-COLUMN LAYOUT ----
  if (slide.layout === "two-column") {
    return (
      <div style={baseStyle} className="flex flex-col p-12">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-3xl font-bold mb-8"
          style={headingStyle}
        />
        <div className="flex gap-8 flex-1">
          <div className="flex-1 p-4 rounded-lg" style={{ backgroundColor: t.cardBg }}>
            {slide.leftText && (
              <EditableText
                value={slide.leftText}
                slideId={slide.id}
                field="leftText"
                editable={editable}
                onUpdate={onUpdate}
                tag="div"
                className="text-base leading-relaxed whitespace-pre-line"
              />
            )}
          </div>
          <div className="flex-1 p-4 rounded-lg" style={{ backgroundColor: t.cardBg }}>
            {slide.rightText && (
              <EditableText
                value={slide.rightText}
                slideId={slide.id}
                field="rightText"
                editable={editable}
                onUpdate={onUpdate}
                tag="div"
                className="text-base leading-relaxed whitespace-pre-line"
              />
            )}
          </div>
        </div>
        {slide.note && (
          <div className="mt-4 p-3 rounded text-sm" style={{ backgroundColor: t.noteBg, color: t.noteText }}>
            <EditableText
              value={slide.note}
              slideId={slide.id}
              field="note"
              editable={editable}
              onUpdate={onUpdate}
              tag="span"
              className=""
            />
          </div>
        )}
      </div>
    );
  }

  // ---- BULLETS LAYOUT ----
  if (slide.layout === "bullets") {
    return (
      <div style={baseStyle} className="flex flex-col p-12">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-3xl font-bold mb-6"
          style={headingStyle}
        />
        {slide.body && (
          <EditableText
            value={slide.body}
            slideId={slide.id}
            field="body"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="text-lg mb-6 leading-relaxed"
          />
        )}
        {slide.bullets && (
          <ul className="space-y-3 ml-2">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-lg">
                <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.accent }} />
                <EditableText
                  value={bullet}
                  slideId={slide.id}
                  field={`bullets.${i}`}
                  editable={editable}
                  onUpdate={onUpdate}
                  tag="span"
                  className=""
                />
              </li>
            ))}
          </ul>
        )}
        {slide.note && (
          <div className="mt-auto p-3 rounded text-sm" style={{ backgroundColor: t.noteBg, color: t.noteText }}>
            <EditableText
              value={slide.note}
              slideId={slide.id}
              field="note"
              editable={editable}
              onUpdate={onUpdate}
              tag="span"
              className=""
            />
          </div>
        )}
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
          className="text-[23px] font-bold mb-1"
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
            className="text-xs mb-5"
            style={subtitleStyle}
          />
        )}

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
                    <span className="text-xl" style={{ color: t.accent }}>→</span>
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
      </div>
    );
  }

  // ---- TABLE LAYOUT ----
  if (slide.layout === "table") {
    return (
      <div style={baseStyle} className="flex flex-col p-10">
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className="text-2xl font-bold mb-2"
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
            className="text-lg mb-4"
            style={subtitleStyle}
          />
        )}
        {slide.note && (
          <EditableText
            value={slide.note}
            slideId={slide.id}
            field="note"
            editable={editable}
            onUpdate={onUpdate}
            tag="p"
            className="text-xs mb-3"
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
                      className="p-2 text-left font-semibold border"
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
                {slide.tableRows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="p-2 border"
                        style={{ borderColor: t.tableBorder }}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ---- STACK LAYOUT (SVG Architecture Diagram) ----
  if (slide.layout === "stack" && slide.stack) {
    // Layout constants
    const W = 960, H = 540;
    const MARGIN = 40;
    const TITLE_H = 58;
    const NOTE_H = 36;
    const LAYER_GAP = 12;
    const ARROW_GAP = 20;
    const diagramW = W - MARGIN * 2;

    // We have 3 layers + 2 arrow gaps between them
    const layers = slide.stack; // bottom-to-top in data, we render top-to-bottom reversed
    const numLayers = layers.length;
    const numArrowGaps = numLayers - 1;
    const totalDiagramH = H - TITLE_H - NOTE_H - MARGIN;
    const layerH = (totalDiagramH - numArrowGaps * ARROW_GAP) / numLayers;

    // Render layers top-to-bottom (reverse of data order: data[0]=bottom, data[last]=top)
    const renderLayers = [...layers].reverse();

    return (
      <div style={baseStyle}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: theme.bodyFont }}>
          {/* Title */}
          <text x={MARGIN} y={32} fill={t.heading} fontSize={22} fontWeight="bold" fontFamily={theme.headingFont}>
            {slide.title}
          </text>
          {slide.subtitle && (
            <text x={MARGIN} y={52} fill={t.subtitle} fontSize={13}>
              {slide.subtitle}
            </text>
          )}

          {/* Layers */}
          {renderLayers.map((layer, li) => {
            const layerY = TITLE_H + li * (layerH + ARROW_GAP);
            const layerX = MARGIN;
            const items = layer.items || [];
            const innerPadTop = 28;
            const innerPadSide = 14;
            const innerH = layerH - innerPadTop - 10;

            // For grid layers (monitoring): small boxes in a row
            // For non-grid layers: two groups side by side (general vs domain)
            if (layer.grid) {
              // Grid of agent cards
              const cols = Math.min(items.length, 9);
              const boxGap = 8;
              const boxW = (diagramW - innerPadSide * 2 - (cols - 1) * boxGap) / cols;
              const boxH = innerH - 4;

              return (
                <g key={li}>
                  {/* Layer container */}
                  <rect x={layerX} y={layerY} width={diagramW} height={layerH} rx={8}
                    fill={t.cardBg} stroke={t.tableBorder} strokeWidth={1.5} />
                  {/* Layer label */}
                  <text x={layerX + innerPadSide} y={layerY + 19} fill={t.accent}
                    fontSize={11} fontWeight="bold" letterSpacing="0.08em">
                    {layer.icon} {layer.label.toUpperCase()}
                  </text>
                  {layer.description && (
                    <text x={layerX + innerPadSide + layer.label.length * 7.5 + 30} y={layerY + 19}
                      fill={t.subtitle} fontSize={10}>
                      {layer.description}
                    </text>
                  )}
                  {/* Agent boxes */}
                  {items.map((item, ii) => {
                    const bx = layerX + innerPadSide + ii * (boxW + boxGap);
                    const by = layerY + innerPadTop;
                    const isAccent = item.accent;
                    return (
                      <g key={ii}>
                        <rect x={bx} y={by} width={boxW} height={boxH} rx={5}
                          fill={isAccent ? t.accent + "20" : t.bg}
                          stroke={isAccent ? t.accent + "80" : t.tableBorder}
                          strokeWidth={1}
                          strokeDasharray={!isAccent && item.icon === "🔵" ? "3,2" : undefined} />
                        <text x={bx + boxW / 2} y={by + boxH / 2 + 4} textAnchor="middle"
                          fill={isAccent ? t.accent : t.subtitle} fontSize={9}>
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            }

            // Non-grid layer: split items into general (no accent) and domain (accent)
            const generalItems = items.filter(i => !i.accent);
            const domainItems = items.filter(i => i.accent);
            const hasTwo = domainItems.length > 0 && generalItems.length > 0;
            const groupGap = 14;
            const groupW = hasTwo ? (diagramW - innerPadSide * 2 - groupGap) / 2 : diagramW - innerPadSide * 2;

            return (
              <g key={li}>
                {/* Layer container */}
                <rect x={layerX} y={layerY} width={diagramW} height={layerH} rx={8}
                  fill={t.cardBg} stroke={t.tableBorder} strokeWidth={1.5} />
                {/* Layer label */}
                <text x={layerX + innerPadSide} y={layerY + 19} fill={t.accent}
                  fontSize={11} fontWeight="bold" letterSpacing="0.08em">
                  {layer.icon} {layer.label.toUpperCase()}
                </text>
                {layer.description && (
                  <text x={layerX + innerPadSide + layer.label.length * 7.5 + 30} y={layerY + 19}
                    fill={t.subtitle} fontSize={10}>
                    {layer.description}
                  </text>
                )}

                {/* General skills group */}
                {generalItems.length > 0 && (
                  <g>
                    <rect x={layerX + innerPadSide} y={layerY + innerPadTop}
                      width={groupW} height={innerH} rx={6}
                      fill={t.bg} stroke={t.tableBorder} strokeWidth={1} />
                    <text x={layerX + innerPadSide + 10} y={layerY + innerPadTop + 16}
                      fill={t.subtitle} fontSize={9} fontWeight="bold" letterSpacing="0.05em">
                      {hasTwo ? "GENERAL SKILLS" : "CAPABILITIES"}
                    </text>
                    {generalItems.map((item, ii) => {
                      const cols = Math.min(generalItems.length, 3);
                      const row = Math.floor(ii / cols);
                      const col = ii % cols;
                      const bw = (groupW - 24) / cols - 4;
                      const bh = 24;
                      const bx = layerX + innerPadSide + 10 + col * (bw + 6);
                      const by = layerY + innerPadTop + 24 + row * (bh + 5);
                      return (
                        <g key={ii}>
                          <rect x={bx} y={by} width={bw} height={bh} rx={4}
                            fill={t.cardBg} stroke={t.tableBorder} strokeWidth={0.75} />
                          <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle"
                            fill={t.text} fontSize={10}>
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Domain skills group */}
                {domainItems.length > 0 && (
                  <g>
                    <rect x={layerX + innerPadSide + (hasTwo ? groupW + groupGap : 0)}
                      y={layerY + innerPadTop}
                      width={hasTwo ? groupW : diagramW - innerPadSide * 2}
                      height={innerH} rx={6}
                      fill={t.accent + "10"} stroke={t.accent + "50"} strokeWidth={1} />
                    <text x={layerX + innerPadSide + (hasTwo ? groupW + groupGap : 0) + 10}
                      y={layerY + innerPadTop + 16}
                      fill={t.accent} fontSize={9} fontWeight="bold" letterSpacing="0.05em">
                      DOMAIN SKILLS (TPA)
                    </text>
                    {domainItems.map((item, ii) => {
                      const gx = layerX + innerPadSide + (hasTwo ? groupW + groupGap : 0);
                      const gw = hasTwo ? groupW : diagramW - innerPadSide * 2;
                      const cols = Math.min(domainItems.length, 3);
                      const row = Math.floor(ii / cols);
                      const col = ii % cols;
                      const bw = (gw - 24) / cols - 4;
                      const bh = 24;
                      const bx = gx + 10 + col * (bw + 6);
                      const by = layerY + innerPadTop + 24 + row * (bh + 5);
                      return (
                        <g key={ii}>
                          <rect x={bx} y={by} width={bw} height={bh} rx={4}
                            fill={t.accent + "20"} stroke={t.accent + "60"} strokeWidth={0.75} />
                          <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle"
                            fill={t.accent} fontSize={10}>
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

          {/* Arrows between layers */}
          {renderLayers.slice(0, -1).map((_, li) => {
            const gapTop = TITLE_H + (li + 1) * layerH + li * ARROW_GAP;
            const gapMid = gapTop + ARROW_GAP / 2;
            const cx = W / 2;
            // Three small chevrons (▼) spread across the width
            const chevronXs = [cx - 100, cx, cx + 100];
            return (
              <g key={`arrow-${li}`}>
                {chevronXs.map((ax, ai) => (
                  <g key={ai} opacity={0.5}>
                    <line x1={ax - 6} y1={gapMid - 3} x2={ax} y2={gapMid + 3}
                      stroke={t.accent} strokeWidth={1.5} strokeLinecap="round" />
                    <line x1={ax + 6} y1={gapMid - 3} x2={ax} y2={gapMid + 3}
                      stroke={t.accent} strokeWidth={1.5} strokeLinecap="round" />
                  </g>
                ))}
              </g>
            );
          })}

          {/* Note at bottom */}
          {slide.note && (
            <g>
              <rect x={MARGIN} y={H - NOTE_H - 6} width={diagramW} height={NOTE_H} rx={4}
                fill={t.noteBg} />
              <text x={MARGIN + 10} y={H - NOTE_H + 16} fill={t.noteText} fontSize={9}>
                {slide.note}
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ---- FALLBACK ----
  return (
    <div style={baseStyle} className="flex flex-col items-center justify-center p-16">
      <h1 className="text-4xl font-bold" style={headingStyle}>{slide.title}</h1>
    </div>
  );
}
