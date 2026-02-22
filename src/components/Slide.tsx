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
                className="text-xs text-right flex-shrink-0"
                style={{ width: 90, color: bar.highlight ? t.heading : t.text, fontWeight: bar.highlight ? 700 : 400 }}
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
            className="text-xs mt-3"
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
      <div style={baseStyle} className={`flex flex-col ${isLargeTeam ? "p-8" : "p-12"}`}>
        <EditableText
          value={slide.title}
          slideId={slide.id}
          field="title"
          editable={editable}
          onUpdate={onUpdate}
          tag="h1"
          className={`font-bold ${isLargeTeam ? "text-2xl mb-5" : "text-3xl mb-8"} text-center`}
          style={headingStyle}
        />
        <div className={`flex ${isLargeTeam ? "gap-3" : "gap-6"} flex-1 items-start`}>
          {slide.team.map((member, i) => (
            <div
              key={i}
              className={`flex-1 flex flex-col items-center text-center ${isLargeTeam ? "p-3" : "p-4"} rounded-lg`}
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
              <EditableText
                value={member.bio}
                slideId={slide.id}
                field={`team.${i}.bio`}
                editable={editable}
                onUpdate={onUpdate}
                tag="p"
                className={`${isLargeTeam ? "text-xs leading-snug" : "text-sm leading-relaxed"}`}
                style={{ color: t.text }}
              />
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

  // ---- FALLBACK ----
  return (
    <div style={baseStyle} className="flex flex-col items-center justify-center p-16">
      <h1 className="text-4xl font-bold" style={headingStyle}>{slide.title}</h1>
    </div>
  );
}
