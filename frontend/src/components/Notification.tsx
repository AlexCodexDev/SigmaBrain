import { closeSnackbar, enqueueSnackbar } from "notistack";

type VariantType =
    | "default"
    | "error"
    | "success"
    | "warning"
    | "info";

export function Notification(
    message: string,
    variantType: VariantType = "default",
    persist = false
) {
    return enqueueSnackbar(message, {
        variant: variantType,
        persist,
        action: persist
            ? (key) => (
                <button onClick={() => closeSnackbar(key)}>
                    x
                </button>
            )
            : undefined
    });
}