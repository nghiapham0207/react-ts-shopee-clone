import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useId, ElementType } from "react";
import {
	FloatingArrow,
	FloatingList,
	FloatingPortal,
	Placement,
	arrow,
	shift,
	useDismiss,
	useFloating,
	useHover,
	useInteractions,
} from "@floating-ui/react";

interface Props {
	children: React.ReactNode;
	renderPopover: React.ReactNode;
	className?: string;
	placement?: Placement;
	as?: ElementType;
	initialOpen?: boolean;
}

export default function Popover({
	children,
	renderPopover,
	className = "",
	placement = "bottom-end",
	as: Element = "div",
	initialOpen = false,
}: Props) {
	const [open, setOpen] = useState(initialOpen);

	const id = useId();

	const arrowRef = useRef(null);
	const elementsRef = useRef([]);
	const labelsRef = useRef([]);

	const { refs, floatingStyles, context } = useFloating({
		open,
		placement: placement,
		middleware: [arrow({ element: arrowRef }), shift()],
	});

	const hover = useHover(context);
	const dismiss = useDismiss(context);
	const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);

	const showPopover = () => {
		setOpen(true);
	};
	const hidePopover = () => {
		setOpen(false);
	};

	return (
		<Element
			ref={refs.setReference}
			{...getReferenceProps()}
			className={className}
			onMouseEnter={showPopover}
			onMouseLeave={hidePopover}>
			{children}
			<AnimatePresence>
				<FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
					{open && (
						<FloatingPortal id={id}>
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
								<div
									ref={refs.setFloating}
									style={{ zIndex: 100, ...floatingStyles }}
									{...getFloatingProps()}>
									<FloatingArrow ref={arrowRef} context={context} fill="white" />
									{renderPopover}
								</div>
							</motion.div>
						</FloatingPortal>
					)}
				</FloatingList>
			</AnimatePresence>
		</Element>
	);
}
