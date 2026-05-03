import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "@/i18n/compat/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "../shared/rich-editor/RichEditor";
import AIPolishDialog from "../shared/ai/AIPolishDialog";
import { useAIConfiguration } from "@/hooks/useAIConfiguration";
import { UnifiedDateInput } from "../ui/unified-date-input";
import { UnifiedDateRangeInput } from "../ui/unified-date-range-input";

interface FieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "date" | "editor" | "date-range";
  placeholder?: string;
  required?: boolean;
  className?: string;
  showPresentSwitch?: boolean;
}

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  className,
  showPresentSwitch,
}: FieldProps) => {
  const [yearInput, setYearInput] = useState("");
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [showPolishDialog, setShowPolishDialog] = useState(false);
  const { checkConfiguration } = useAIConfiguration();
  const t = useTranslations();

  const currentDate = useMemo(
    () => (value ? new Date(value) : undefined),
    [value]
  );

  useEffect(() => {
    if (type === "date" && value) {
      const date = new Date(value);
      setYearInput(date.getFullYear().toString());
      setDisplayMonth(date);
    }
  }, [type, value]);

  useEffect(() => {
    if (type === "date") {
      if (!currentDate && fromDate) {
        setFromDate(undefined);
      } else if (
        currentDate &&
        (!fromDate || currentDate.getTime() !== fromDate.getTime())
      ) {
        setFromDate(currentDate);
      }
    }
  }, [type, currentDate, fromDate]);

  const isPresentValue = useMemo(() => {
    return value === t("field.toPresent") || value.endsWith(` - ${t("field.toPresent")}`);
  }, [value, t]);

  const handlePresentToggle = (checked: boolean) => {
    if (type === "date") {
      onChange(checked ? t("field.toPresent") : "");
    } else if (type === "date-range") {
      const [start] = value.split(" - ");
      onChange(
        checked
          ? [start, t("field.toPresent")].filter(Boolean).join(" - ")
          : start || ""
      );
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    return (
      <div className="flex items-center justify-between mb-1.5 font-medium">
        <span className="text-sm text-foreground">
          {label}
        </span>
        {showPresentSwitch && (
          <div className="flex items-center gap-2">
            <Switch
              checked={isPresentValue}
              onCheckedChange={handlePresentToggle}
            />
            <span className="text-xs text-muted-foreground">
              {t("field.toPresent")}
            </span>
          </div>
        )}
      </div>
    );
  };

  const inputStyles = cn(
    "block w-full rounded-md border-0 py-1.5 px-3",
    "text-foreground bg-background",
    "shadow-sm ring-1 ring-inset ring-input",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
    "sm:text-sm sm:leading-6",
    className
  );

  if (type === "date") {
    const dateValue = value ? new Date(value.includes('/') ? value.replace(/\//g, '-') : value) : undefined;
    
    return (
      <div className="block">
        {renderLabel()}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal h-9 rounded-md border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                !value && "text-muted-foreground",
                className
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? value : <span>{placeholder || t("field.selectDate")}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  onChange(`${y}/${m}`);
                } else {
                  onChange("");
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (type === "date-range") {
    return (
      <div className="block">
        {renderLabel()}
        <UnifiedDateRangeInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <label className="block">
        {renderLabel()}
        <motion.textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputStyles}
          required={required}
          rows={4}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
        />
      </label>
    );
  }

  if (type === "editor") {
    return (
      <motion.div className="block">
        {renderLabel()}
        <div className="mt-1.5">
          <RichTextEditor
            content={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            onPolish={() => {
              if (checkConfiguration()) {
                setShowPolishDialog(true);
              }
            }}
          />
        </div>

        <AIPolishDialog
          open={showPolishDialog}
          onOpenChange={setShowPolishDialog}
          content={value || ""}
          onApply={(content) => {
            onChange(content);
          }}
        />
      </motion.div>
    );
  }

  return (
    <label className="block">
      {renderLabel()}
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputStyles}
        required={required}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      />
    </label>
  );
};

export default Field;
