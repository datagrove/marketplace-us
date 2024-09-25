export function sortResourceTypes(list: Array<{ id: number; type: string }>) {
    const exceptions: Record<string, { id: number; type: string }> = {
        Other: { id: 11, type: "Other" },
    };

    list.sort(function (a, b) {
        if (exceptions[a.type]) {
            //only `a` is in exceptions, sort it to back
            return 1;
        } else if (exceptions[b.type]) {
            //only `b` is in exceptions, sort it to front
            return -1;
        } else {
            //no exceptions to account for, return alphabetic sort
            return a.type.localeCompare(b.type);
        }
    });

    return list;
}
