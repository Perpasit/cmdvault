import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type CreatableSelectProps = {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (value: string) => void;
    options: string[];
    placeholder?: string;
};

export default function CreatableSelect({
    value,
    onChange,
    onSelect,
    options,
    placeholder = "Select or enter a value",
}: CreatableSelectProps) {
    const [isOpen, setIsOpen] =
        useState(false);

    const [isTyping, setIsTyping] =
        useState(false);

    const containerRef =
        useRef<HTMLDivElement>(null);

    const normalizedValue =
        value.trim().toLowerCase();

    /*
     * เปิด dropdown ปกติ
     * -> แสดงทั้งหมด
     *
     * กำลังพิมพ์
     * -> filter ตามข้อความ
     */
    const filteredOptions =
        useMemo(() => {
            if (!isTyping) {
                return options;
            }

            return options.filter(
                (option) =>
                    option
                        .toLowerCase()
                        .includes(
                            normalizedValue
                        )
            );
        }, [
            options,
            normalizedValue,
            isTyping,
        ]);

    const exactMatch =
        options.some(
            (option) =>
                option
                    .trim()
                    .toLowerCase() ===
                normalizedValue
        );

    /*
     * Click outside -> close
     */
    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsOpen(false);
                setIsTyping(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /*
     * เลือก option จาก dropdown
     */
    const handleSelect = (
        option: string
    ) => {
        onChange(option);

        if (onSelect) {
            onSelect(option);
        }

        setIsOpen(false);
        setIsTyping(false);
    };

    /*
     * กดลูกศร
     * -> เปิดทั้งหมด
     */
    const handleToggle = () => {
        setIsTyping(false);

        setIsOpen(
            (current) => !current
        );
    };

    return (
        <div
            className="creatable-select"
            ref={containerRef}
        >
            <div className="creatable-select-control">
                <input
                    value={value}
                    onChange={(event) => {
                        onChange(
                            event.target.value
                        );

                        setIsTyping(true);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsTyping(false);
                        setIsOpen(true);
                    }}
                    placeholder={
                        placeholder
                    }
                />

                <button
                    type="button"
                    className="creatable-select-toggle"
                    onClick={
                        handleToggle
                    }
                    aria-label="Toggle options"
                >
                    ▾
                </button>
            </div>

            {isOpen && (
                <div className="creatable-select-menu">
                    {filteredOptions.map(
                        (option) => (
                            <button
                                key={option}
                                type="button"
                                className="creatable-select-option"
                                onMouseDown={(
                                    event
                                ) =>
                                    event.preventDefault()
                                }
                                onClick={() =>
                                    handleSelect(
                                        option
                                    )
                                }
                            >
                                {option}
                            </button>
                        )
                    )}

                    {isTyping &&
                        value.trim() &&
                        !exactMatch && (
                            <button
                                type="button"
                                className="creatable-select-option creatable-select-create"
                                onMouseDown={(
                                    event
                                ) =>
                                    event.preventDefault()
                                }
                                onClick={() =>
                                    handleSelect(
                                        value.trim()
                                    )
                                }
                            >
                                + Add "{value.trim()}"
                            </button>
                        )}

                    {filteredOptions.length ===
                        0 &&
                        !value.trim() && (
                            <div className="creatable-select-empty">
                                No options
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}