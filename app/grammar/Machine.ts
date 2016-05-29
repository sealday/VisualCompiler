export interface Machine {
    canAnalyze();
    stop();
    analyze(options: any);
    result();
    current();
    canNext() ;
    next();
    canPrev();
    prev();
    lines();
}