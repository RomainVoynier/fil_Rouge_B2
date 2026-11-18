CREATE ROLE nexus_operator WITH LOGIN PASSWORD 'SecurePassword_Op123!';
CREATE ROLE nexus_auditor WITH LOGIN PASSWORD 'SecurePassword_Aud123!';

GRANT USAGE ON SCHEMA public TO nexus_operator;
GRANT SELECT, INSERT, UPDATE ON TABLE public.equipments TO nexus_operator;
GRANT SELECT, INSERT, UPDATE ON TABLE public.incidents TO nexus_operator;
REVOKE DELETE ON TABLE public.equipments FROM nexus_operator;

GRANT USAGE ON SCHEMA public TO nexus_auditor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO nexus_auditor;

CREATE OR REPLACE VIEW public.v_operator_active_incidents AS
SELECT 
    i.id AS incident_id,
    e.name AS equipment_name,
    i.status,
    i.created_at
FROM public.incidents i
JOIN public.equipments e ON i.equipment_id = e.id
WHERE i.status != 'resolved';

CREATE OR REPLACE VIEW public.v_audit_incidents_log AS
SELECT 
    id,
    equipment_id,
    status,
    created_at,
    updated_at
FROM public.incidents;

GRANT SELECT ON public.v_operator_active_incidents TO nexus_operator;
GRANT SELECT ON public.v_audit_incidents_log TO nexus_auditor;

CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX idx_equipments_name ON public.equipments(name);

CREATE OR REPLACE FUNCTION public.update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_incidents_modtime
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp_column();